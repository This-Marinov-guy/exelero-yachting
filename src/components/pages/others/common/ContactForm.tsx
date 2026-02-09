"use client";

import { ContactFormInputs } from "@/types/Other";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Col, Form, Row } from "reactstrap";
import { toast } from "sonner";
import { useState } from "react";

const ContactForm = () => {
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
        toast.error(json.error || "Failed to send message. Please try again.");
        return;
      }
      toast.success("Message sent successfully. We'll get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='form-box bg-transparent p-0'>
      <Form className='login-form contact-form' onSubmit={handleSubmit(onSubmitData)}>
        <Row>
          <Col lg={6}>
            <div className='form-input'>
              <input type='text' {...register("firstName", { required: "First name is required" })} placeholder='First Name' className={`form-control ${errors.firstName ? "is-invalid" : ""}`} />
              {errors.firstName && <div className='invalid-feedback'>{errors.firstName.message}</div>}
            </div>
          </Col>
          <Col lg={6}>
            <div className='form-input'>
              <input type='text' {...register("lastName", { required: "Last name is required" })} placeholder='Last Name' className={`form-control ${errors.lastName ? "is-invalid" : ""}`} />
              {errors.lastName && <div className='invalid-feedback'>{errors.lastName.message}</div>}
            </div>
          </Col>
          <Col lg={6}>
            <div className='form-input'>
              <input
                type='tel'
                {...register("number", {
                  required: "Phone number is required",
                  minLength: {
                    value: 10,
                    message: "Phone number must be at least 10 digits",
                  },
                  maxLength: {
                    value: 15,
                    message: "Phone number must not exceed 15 digits",
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Phone number must contain only numbers",
                  },
                })}
                placeholder='Phone Number'
                className={`form-control ${errors.number ? "is-invalid" : ""}`}
              />
              {errors.number && <div className='invalid-feedback'>{errors.number.message}</div>}
            </div>
          </Col>
          <Col lg={6}>
            <div className='form-input'>
              <input type='email' {...register("email", { required: "email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, message: "Invalid email address" } })} placeholder='Email' className={`form-control ${errors.email ? "is-invalid" : ""}`} />
              {errors.email && <div className='invalid-feedback'>{errors.email.message}</div>}
            </div>
          </Col>
          <Col xs={12}>
            <div className='form-input'>
              <textarea {...register("message", { required: "Message is required", minLength: { value: 10, message: "Message must be at least 10 characters" } })} placeholder='Message' className={`form-control mb-0 ${errors.message ? "is-invalid" : ""}`} defaultValue={""} />
              {errors.message && <div className='invalid-feedback'>{errors.message.message}</div>}
            </div>
          </Col>
          <Col xl={4} lg={5} xs={8}>
            <Button type='submit' className='btn-solid' disabled={submitting}>
              {submitting ? "Sending…" : "Send Message"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ContactForm;
