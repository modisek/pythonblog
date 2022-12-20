export default function Footer() {
  return (
    <footer>
      <p>
        last session lasted from {localStorage.getItem("logIn")} until
        {localStorage.getItem("logOut")}
      </p>
    </footer>
  );
}
