import { play } from "cuelume";
import { ExternalToast, toast as sonnerToast } from "sonner";

export const toast = {
  ...sonnerToast,

  success: (message: string | React.ReactNode, data?: ExternalToast) => {
    play("success");
    return sonnerToast.success(message, data);
  },

  error: (message: string | React.ReactNode, data?: ExternalToast) => {
    play("error");
    return sonnerToast.error(message, data);
  },

  warning: (message: string | React.ReactNode, data?: ExternalToast) => {
    play("pulse");
    return sonnerToast.warning(message, data);
  },

  info: (message: string | React.ReactNode, data?: ExternalToast) => {
    play("whisper");
    return sonnerToast.info(message, data);
  },

  loading: (message: string | React.ReactNode, data?: ExternalToast) => {
    play("loading");
    return sonnerToast.loading(message, data);
  },

  dismiss: (toastId?: string | number) => {
    play("droplet");
    return sonnerToast.dismiss(toastId);
  },
};
