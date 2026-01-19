import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setLogoutModal } from "@/redux/reducers/LayoutSlice";
import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import CloseBtn from "../CloseBtn";
import { Cancel, Logout, LogoutContent, LogoutTitle, SVGPath } from "@/constants";
import Link from "next/link";
import { RouteList } from "@/utils/RouteList";

const ModalLogout = () => {
  const { logoutModal } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const toggle = () => dispatch(setLogoutModal());
  return (
    <Modal fade centered className='theme-modal' isOpen={logoutModal} toggle={toggle}>
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content'>
          <ModalHeader toggle={toggle} close={<CloseBtn toggle={toggle} />} />
          <ModalBody>
            <div className='logout-img'>
              <img src={`${SVGPath}/other/logout.svg`} alt='logout' className='img-fluid d-block mx-auto' />
            </div>
            <div className='logout-content'>
              <h4 className='text-center'>{LogoutTitle}</h4>
              <p className='text-center'>{LogoutContent}</p>
              <div className='d-flex align-items-center justify-content-center gap-2'>
                <Button className='btn-border' onClick={toggle}>
                  {Cancel}
                </Button>
                <Link href={RouteList.Pages.Other.Login1} className='btn-solid'>
                  {Logout}
                </Link>
              </div>
            </div>
          </ModalBody>
        </div>
      </div>
    </Modal>
  );
};

export default ModalLogout;
