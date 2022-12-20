import Link from "next/link";

export default function Error({ text }) {
  return (
    <div
      className="alert text-red-400 alert-danger d-flex align-items-center mb-3"
      role="alert"
    >
      <div className="ms-1">{text}.</div>
    </div>
  );
}
