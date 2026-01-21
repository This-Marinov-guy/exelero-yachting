import CommonInput from "@/components/commonComponents/CommonInput";
import { NotAccount, ImagePath, LogIn, LogInWithFacebook, LogInWithGoogle, LogInYourAccount, Remember, SignUp, Welcome, Href } from "@/constants";
import { useAppDispatch } from "@/redux/hooks";
import { setLoginModal, setSignUpModal } from "@/redux/reducers/LayoutSlice";
import { RouteList } from "@/utils/RouteList";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "reactstrap";

const LoginMain = () => {

  const pathname = usePathname() || "";
  const dispatch = useAppDispatch();
  const segments = pathname.split("/").slice(1);

  const handleNavigate = () => {
    segments[2] === "login-4" && dispatch(setSignUpModal());
    dispatch(setLoginModal());
  };

  return (
    <div className='form-box'>
      <div className='login-title'>
        <h3>{Welcome}</h3>
        <h5>{LogInYourAccount}</h5>
      </div>
      <form className='login-form'>
        <CommonInput inputType='email' placeholder='Enter Your Email' />
        <CommonInput inputType='password' placeholder='Enter Your password' />
        <div className='form-check-box'>
          <input type='checkbox' id='Remember' />
          <label htmlFor='Remember'>{Remember}</label>
        </div>
        <Button className='btn-solid' type='button'>
          {LogIn}
        </Button>
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
          <h6>{NotAccount}</h6>
          <Link href={segments[2] === "login-4" ? Href : RouteList.Pages.Other.SignUp1} onClick={handleNavigate}>{SignUp}</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginMain;
