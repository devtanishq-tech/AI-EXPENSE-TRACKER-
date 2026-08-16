export type streamResponse =
  | {
      type: "ai";
      payload: { text: string };
    }
  | {
      type: "tooCall:start";
      payload: {
        name: string;
        args: Record<string, any>;
      };
    }
  | {
      type: "tool";
      payload: {
        name: string;
        result: Record<string, any>;
      };
    };
