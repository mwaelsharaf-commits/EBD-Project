import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Field({ icon: Icon, type = "text", children, ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="field">
      {Icon && <Icon size={18} />}

      {type === "select" ? (
        <select {...props}>{children}</select>
      ) : (
        <input type={isPassword && show ? "text" : type} {...props} />
      )}

      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}