import s from './RequestTypesItem.module.scss';
import { RequestTypeItemProps } from './RequestTypeItem.props';

export default function RequestTypesItem(props: RequestTypeItemProps) {
  const { heading, request, response, footer } = props.request;

  return (
    <div className={s.table}>
      <p className={s.th}>
        <span className={s.accent}>{heading.title}</span>- {heading.main}
      </p>
      <p className={s.tReqH}>Запрос</p>
      <p className={s.tResH}>Ответ</p>
      <pre className={s.tReqB}>
        <div className={s.langTag}>
          <span>cURL</span>
        </div>
        <code>{request}</code>
      </pre>
      <pre className={s.tResB}>
        <div className={s.langTag}>
          <span>JSON</span>
        </div>
        <code>{response}</code>
      </pre>
      {!!footer && (
        <div className={s.tf}>
          {footer.map((e, i) => (
            <p key={i} className={s.tfRow}>
              {e}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
