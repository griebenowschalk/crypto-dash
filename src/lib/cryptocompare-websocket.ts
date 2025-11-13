import { WebSocketPriceUpdate } from '@/types/crypto';

const API_KEY = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY;
const BASE_URL = 'wss://streamer.cryptocompare.com/v2';

/**
 * CryptoCompare WebSocket API
 * https://developers.coindesk.com/documentation/legacy-websockets/HowToConnect
 *
 * Callback subscription pattern example:
 *
 * "BTC-USD": [callback1, callback2, callback3]
 * "ETH-USD": [callback4, callback5]
 * "SOL-USD": [callback6]
 *
 * When a trade update is received for "BTC-USD", all callbacks in the "BTC-USD" array will be called with the trade update data.
 */

class CryptoCompareWebSocket {
  private apiKey: string;
  private ws: WebSocket | null = null;
  private subscriptions: Map<
    string,
    Set<(data: WebSocketPriceUpdate) => void> // callback for each subscription
  > = new Map();
  private subscribeChannels: Set<string> = new Set();
  private reconnectionAttempts = 0;
  private maxReconnectionAttempts = 5;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.connect(this.apiKey);
  }

  private connect(apiKey: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(`${BASE_URL}?api_key=${apiKey}`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectionAttempts = 0;
      this.subscribeChannels.forEach(channel => {
        this.ws?.send(
          JSON.stringify({
            action: 'SubAdd',
            subs: [channel],
          })
        );
      });
    };

    this.ws.onmessage = event => {
      const data = JSON.parse(event.data) as WebSocketPriceUpdate;

      // 5 is trade updates
      if (data.TYPE === '5' && data.FROMSYMBOL && data.TOSYMBOL) {
        const key = `${data.FROMSYMBOL}-${data.TOSYMBOL}`;
        const callbacks = this.subscriptions.get(key);

        // call all callbacks for this subscription
        if (callbacks) {
          callbacks.forEach(callback => callback(data));
        }
      }
    };

    this.ws.onerror = error => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.attemptReconnect();
    };
  }

  private attemptReconnect(): void {
    if (this.reconnectionAttempts < this.maxReconnectionAttempts) {
      this.reconnectionAttempts++;
      const delay = 1000 * Math.pow(2, this.reconnectionAttempts);
      setTimeout(() => this.connect(this.apiKey || API_KEY), delay);
    }
  }

  /**
   * Subscribe to real-time price updates for one or more coins.
   *
   * @param coins - Array of coin symbols (e.g., ['BTC', 'ETH'])
   * @param currency - Target currency (e.g., 'USD')
   * @param callback - Function called when price updates arrive
   * @returns Unsubscribe function - call to remove this subscription
   */
  subscribe(
    coins: string[],
    currency: string,
    callback: (data: WebSocketPriceUpdate) => void
  ): () => void {
    coins.forEach(coin => {
      const key = `${coin}-${currency}`;

      if (!this.subscriptions.has(key)) {
        this.subscriptions.set(key, new Set());
      }

      this.subscriptions.get(key)?.add(callback);

      const channel = `5~CCCAGG~${coin}~${currency}`;
      this.subscribeChannels.add(channel);

      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws?.send(
          JSON.stringify({
            action: 'SubAdd',
            subs: [channel],
          })
        );
      }
    });

    return () => {
      coins.forEach(coin => {
        const key = `${coin}-${currency}`;
        const callbacks = this.subscriptions.get(key);

        if (callbacks) {
          callbacks.delete(callback);

          if (callbacks.size === 0) {
            this.subscriptions.delete(key);
            const channel = `5~CCCAGG~${coin}~${currency}`;
            this.subscribeChannels.delete(channel);

            if (this.ws?.readyState === WebSocket.OPEN) {
              this.ws?.send(
                JSON.stringify({
                  action: 'SubRemove',
                  subs: [channel],
                })
              );
            }
          }
        }
      });
    };
  }

  disconnect() {
    this.ws?.close();
    this.subscriptions.clear();
    this.subscribeChannels.clear();
  }
}

export const cryptoCompareWebSocket = new CryptoCompareWebSocket(API_KEY!);
