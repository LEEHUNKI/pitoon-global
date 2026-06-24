export {};

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => void;
      authenticate: (
        scopes: string[],
        callbacks: {
          onIncompletePaymentFound?: (payment: any) => void;
        }
      ) => Promise<any>;
      createPayment: (
        paymentData: {
          amount: number;
          memo: string;
          metadata: Record<string, any>;
        },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void;
          onReadyForServerCompletion: (
            paymentId: string,
            txid: string
          ) => void;
          onCancel: (paymentId: string) => void;
          onError: (error: any, payment?: any) => void;
        }
      ) => void;
    };
  }
}