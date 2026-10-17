"use client";

import { FC, useEffect, useRef, useState } from "react";
import { ProductType } from "@/types/Product";
import InquiryForm from "@/components/commonComponents/InquiryForm";
import Image from "next/image";
import { MessageSquareText } from "lucide-react";
import { trackClarityEvent } from "@/lib/clarity";
import styles from "./BoatDetailSidebar.module.scss";
import { usePublicText } from "@/lib/usePublicText";

interface BoatDetailSidebarProps {
    boat: ProductType;
}

const BoatDetailSidebar: FC<BoatDetailSidebarProps> = ({ boat }) => {
    const tr = usePublicText();
    const formRef = useRef<HTMLDivElement>(null);
    const [showContact, setShowContact] = useState(false);

    useEffect(() => {
        const form = formRef.current;
        if (!form) return;

        const observer = new IntersectionObserver(([entry]) => {
            setShowContact(entry.intersectionRatio < 0.1);
        }, { threshold: 0.1 });
        observer.observe(form);

        return () => observer.disconnect();
    }, [boat.boatId]);

    const scrollToContactForm = () => {
        const form = formRef.current;
        if (!form) return;

        form.focus({ preventScroll: true });
        form.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
        trackClarityEvent("boat_contact_form_clicked");
    };

    return (
        <>
            <div className="detail-sidebar">
                <div className="detail-sub-sidebar">
                    {/* Contact Information */}
                    <div className="sidebar-box">
                        <h5 className="mb-3">{tr("Contact Information")}</h5>

                        {/* Dealer Profile Image */}
                        {boat.brokerProfileImage && (
                            <div className="dealer-profile-image mb-3" style={{ textAlign: 'center' }}>
                                <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(var(--theme-color), 0.2)' }}>
                                    <Image
                                        src={boat.brokerProfileImage}
                                        alt={boat.dealer || "Brokerage"}
                                        fill
                                        className="object-contain"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        )}

                        {boat.dealer && (
                            <div className="contact-item mb-2">
                                <strong>{tr("Company:")}</strong> <span>{boat.dealer}</span>
                            </div>
                        )}

                        {boat.brokerName && (
                            <div className="contact-item mb-2">
                                <strong>{tr("Broker Name:")}</strong> <span>{boat.brokerName}</span>
                            </div>
                        )}
                        {boat.brokerEmail && (
                            <div className="contact-item mb-2">
                                <strong>{tr("Email:")}</strong>{" "}
                                <a href={`mailto:${boat.brokerEmail}`} onClick={() => trackClarityEvent("boat_email_clicked")}>{boat.brokerEmail}</a>
                            </div>
                        )}
                        {boat.brokerPhone && (
                            <div className="contact-item mb-2">
                                <strong>{tr("Phone:")}</strong>{" "}
                                <a href={`tel:${boat.brokerPhone}`} onClick={() => trackClarityEvent("boat_phone_clicked")}>{boat.brokerPhone}</a>
                            </div>
                        )}
                        {boat.boatId && <div ref={formRef} tabIndex={-1} className={styles.formTarget}><InquiryForm endpoint={`/api/boats/${boat.boatId}/inquiries`} subject={boat.title} /></div>}
                    </div>
                </div>
            </div>
            {boat.boatId && (
                <div className={`tap-to-tap ${styles.floatingContact} ${showContact ? "show" : ""}`} aria-hidden={!showContact}>
                    <button
                        type="button"
                        className={`top-box ${styles.contactButton}`}
                        aria-label={tr("Scroll to contact form")}
                        title={tr("Scroll to contact form")}
                        onClick={scrollToContactForm}
                        tabIndex={showContact ? 0 : -1}
                    >
                        <MessageSquareText size={22} aria-hidden="true" />
                    </button>
                </div>
            )}
        </>
    );
};

export default BoatDetailSidebar;
