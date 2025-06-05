import css from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  error: Error;
}
export default function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <p className={css.text}>
      There was an error: {error.message}, please try again...
    </p>
  );
}
