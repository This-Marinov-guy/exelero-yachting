import CommonInput from "@/components/commonComponents/CommonInput";
import { AlreadyAnAccount, ConditionAccept, CreateAnAccount, Href, ImagePath, LogIn, LogInWithFacebook, LogInWithGoogle, PrivacyPolicy, SignUpAccount, Terms, Welcome } from "@/constants";
import { useAppDispatch } from "@/redux/hooks";
import { setLoginModal, setSignUpModal } from "@/redux/reducers/LayoutSlice";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { Button } from "reactstrap";

const SignUpMain: FC<{ classname?: string }> = ({ classname }) => {

  const pathname = usePathname() || "";
  const dispatch = useAppDispatch();
  const segments = pathname.split("/").slice(1);

  const handleNavigate = () => {
    segments[2] === "login-4" && dispatch(setLoginModal());
    dispatch(setSignUpModal());
  };
  return (
    <div className={`${classname ? classname : ""} form-box`}>
      <div className='login-title'>
        <h3>{Welcome}</h3>
        <h5>{SignUpAccount}</h5>
      </div>
      <form className='login-form'>
        <CommonInput inputType='text' placeholder='Enter Your Full Name' />
        <CommonInput inputType='email' placeholder='Enter Your Email' />
        <CommonInput inputType='password' placeholder='Enter Your password' />
        <div className='form-check-box align-items-start'>
          <input type='checkbox' id='Remember' />
          <label htmlFor='Remember' className='line-height-change'>
            {ConditionAccept}
            <Link href={RouteList.Pages.Other.Condition} className='text-decoration-underline theme-color'>
              {Terms}
            </Link>
            {"as well as the"}
            <Link href={RouteList.Pages.Other.Privacy} className='text-decoration-underline theme-color'>
              {PrivacyPolicy}
            </Link>
          </label>
        </div>
        <Button className='btn-solid'>{CreateAnAccount}</Button>
        <div className='text-divider'>
          <span>OR</span>
        </div>
        <ul className='login-social'>
          <li>
            <Link href='https://www.google.com/' target='_blank'>
              <img src={`${ImagePath}/other/google.png`} alt='facebook' className='img-fluid' />
              <span>{LogInWithGoogle}</span>
            </Link>
          </li>
          <li>
            <Link href='https://www.facebook.com/' target='_blank'>
              <img src={`${ImagePath}/other/facebook.png`} alt='facebook' className='img-fluid' />
              <span>{LogInWithFacebook}</span>
            </Link>
          </li>
        </ul>
        <div className='signup-box'>
          <h6>{AlreadyAnAccount}</h6>
          <Link href={segments[2] === "login-4" ? Href : RouteList.Pages.Other.Login1} onClick={handleNavigate}>{LogIn}</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpMain;
