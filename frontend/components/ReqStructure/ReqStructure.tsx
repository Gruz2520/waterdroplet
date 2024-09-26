import s from './ReqStructure.module.scss';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);
import { useEffect } from 'react';

export default function ReqStructure() {
  useEffect(() => {
    hljs.initHighlighting();
  }, []);

  const codeFragment = `JSON
{
upload_image: File, 
token: str = Form()
}`;
  return (
    <div className={s.wrapper}>
      <section className={s.section}>
        <h2 className={s.title}>Структура запроса</h2>
        <div className={s.schemeContainer}>
          <p className={s.schemeItem + ' ' + s.itemWide}>ЗАПРОС</p>
          <div className={s.schemeRow}>
            <p className={s.schemeItem}>Фотография</p>
            <p className={s.schemeItem}>Секретный ключ</p>
          </div>
        </div>
        <pre className={s.code}>
          <div className={s.langTag}>
            <span>JSON</span>
          </div>
          <code>{codeFragment}</code>
        </pre>
      </section>
    </div>
  );
}
