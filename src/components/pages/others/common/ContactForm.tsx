"use client";

import { usePublicError, usePublicText } from "@/lib/usePublicText";
import { ContactFormInputs } from "@/types/Other";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Col, Form, Row } from "reactstrap";
import { toast } from "sonner";
import { useState } from "react";
import { trackClarityEvent } from "@/lib/clarity";

const ContactForm = () => {
  const tr = usePublicText();
  const localError = usePublicError();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormInputs>();

  const onSubmitData: SubmitHandler<ContactFormInputs> = async (data) => {
    if (submitting) return;
    try {
      setSubmitting(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          number: data.number,
          message: data.message,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ? localError(json.error, "Failed to send message. Please try again.") : tr("Failed to send message. Please try again."));
        return;
      }
      toast.success(tr("Thank you. We'll get back to you soon."));
      trackClarityEvent("contact_inquiry_submitted");
      reset();
    } catch {
      toast.error(tr("Failed to send message. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='form-box bg-transparent p-0'>
      <Form className='login-form contact-form' onSubmit={handleSubmit(onSubmitData)} noValidate>
        <Row>
          <Col lg={6}>
            <div className='form-input'>
              <label htmlFor='contact-first-name'>{tr("First Name")}</label>
              <input id='contact-first-name' type='text' {...register("firstName", { required: tr("First name is required") })} placeholder={tr("First Name")} className={`form-control ${errors.firstName ? "is-invalid" : ""}`} />
              {errors.firstName && <div className='invalid-feedback'>{errors.firstName.message}</div>}
            </div>
          </Col>
          <Col lg={6}>
            <div className='form-input'>
              <label htmlFor='contact-last-name'>{tr("Last Name")}</label>
              <input id='contact-last-name' type='text' {...register("lastName", { required: tr("Last name is required") })} placeholder={tr("Last Name")} className={`form-control ${errors.lastName ? "is-invalid" : ""}`} />
              {errors.lastName && <div className='invalid-feedback'>{errors.lastName.message}</div>}
            </div>
          </Col>
          <Col lg={6}>
            <div className='form-input'>
              <label htmlFor='contact-phone'>{tr("Phone Number")}</label>
              <input
                id='contact-phone'
                type='tel'
                {...register("number", {
                  required: tr("Phone number is required"),
                  minLength: {
                    value: 10,
                    message: tr("Phone number must be at least 10 digits"),
                  },
                  maxLength: {
                    value: 15,
                    message: tr("Phone number must not exceed 15 digits"),
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: tr("Phone number must contain only numbers"),
                  },
                })}
                placeholder={tr("Phone Number")}
                className={`form-control ${errors.number ? "is-invalid" : ""}`}
              />
              {errors.number && <div className='invalid-feedback'>{errors.number.message}</div>}
            </div>
          </Col>
          <Col lg={6}>
            <div className='form-input'>
              <label htmlFor='contact-email'>{tr("Email")}</label>
              <input id='contact-email' type='email' {...register("email", { required: tr("email is required"), pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: tr("Invalid email address") } })} placeholder={tr("Email")} className={`form-control ${errors.email ? "is-invalid" : ""}`} />
              {errors.email && <div className='invalid-feedback'>{errors.email.message}</div>}
            </div>
          </Col>
          <Col xs={12}>
            <div className='form-input'>
              <label htmlFor='contact-message'>{tr("Message")}</label>
              <textarea
                id='contact-message'
                {...register("message", {
                  required: tr("Message is required."),
                  validate: (value) => value.trim().length > 0 || tr("Message is required."),
                  maxLength: { value: 3000, message: tr("Keep your message within 3,000 characters") },
                })}
                required
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
                placeholder={tr("Tell us how we can help")}
                className={`form-control mb-0 ${errors.message ? "is-invalid" : ""}`}
              />
              {errors.message && <div id='contact-message-error' className='invalid-feedback' role='alert'>{errors.message.message}</div>}
            </div>
          </Col>
          <Col xl={4} lg={5} xs={8}>
            <Button type='submit' className='btn-solid' disabled={submitting}>
              {submitting ? tr("Sending…") : tr("Send inquiry")}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ContactForm;
