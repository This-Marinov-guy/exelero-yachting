import Link from "next/link";
import { RouteList } from "@/utils/RouteList";

type SignUpMainProps = {
  classname?: string;
  asPage?: boolean;
};

export default function SignUpMain({ classname }: SignUpMainProps) {
  return (
    <div className={`${classname || ""} form-box auth-form-box`}>
      <div className="login-title">
        <h3>Accounts are by invitation</h3>
        <p>Contact Exelero Yachting if you need access to an existing account.</p>
      </div>
      <div className="auth-alt-actions">
        <Link href={RouteList.Pages.Other.ContactUs1} className="btn-solid">
          Contact us
        </Link>
        <Link href={RouteList.Auth.SignIn}>Already invited? Sign in</Link>
      </div>
    </div>
  );
}
