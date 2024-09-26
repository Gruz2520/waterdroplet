import { URL_ENDPOINTS } from './constants';
import { ContactFormData } from '@/models/models';
import { SYSTEM_MESSAGES } from './constants';
import FileSaver from 'file-saver';

const api = {
  sendForm: async (data: ContactFormData) => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_DOMAIN +
          URL_ENDPOINTS.SEND_FORM +
          '?' +
          new URLSearchParams(data),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const response = await res.json();
      if (!res.ok) {
        return {
          ...response,
          message: SYSTEM_MESSAGES.SEND_FORM_ERROR,
        };
      } else {
        return {
          ...response,
          message: SYSTEM_MESSAGES.SEND_FORM_SCSS,
        };
      }
    } catch (err) {
      return {
        detail: 'error',
        message: err.message,
      };
    }
  },
  saveFile: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.SAVE_FILE,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: token }),
        }
      );
      if (!res.ok) {
        return {
          message: SYSTEM_MESSAGES.DOWNLOAD_ERROR,
        };
      } else {
        const response = await res.blob();
        FileSaver.saveAs(response, 'report.xlsx');
        return {
          message: SYSTEM_MESSAGES.DOWNLOAD_SCSS,
        };
      }
    } catch (err) {
      return {
        detail: 'error',
        message: err.message,
      };
    }
  },
};

export default api;
