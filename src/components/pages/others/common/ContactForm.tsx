import { ContactFormInputs } from "@/types/Other";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Col, Form, Input, Label, Row } from "reactstrap";

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors }, reset, } = useForm<ContactFormInputs>();
  const onSubmitData: SubmitHandler<ContactFormInputs> = (data) => { reset();};

  return (
    <div className='form-box bg-transparent p-0'>
      <Form className='login-form contact-form' onSubmit={handleSubmit(onSubmitData)}>
        <Row>
          <Col lg={6}>
            <div className='form-input'>
              <input type='text' {...register("firstName", { required: "firstName is required" })} placeholder='First Name' className={`form-control ${errors.firstName ? "is-invalid" : ""}`} />
              {errors.firstName && <div className='invalid-feedback'>{errors.firstName.message}</div>}
            </div>
          </Col>
          <Col lg={6}>
            <div className='form-input'>
              <input type='text' {...register("lastName", { required: "lastName is required" })} placeholder='Last Name' className={`form-control ${errors.lastName ? "is-invalid" : ""}`} />
              {errors.lastName && <div className='invalid-feedback'>{errors.lastName.message}</div>}
            </div>
          </Col>
          <Col lg={6}>
            <div className='form-input'>
              <input
                type='number'
                {...register("number", {
                  required: "Number is required",
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
              <textarea {...register("message", { required: "message is required", min: 10, max: 10 })} placeholder='Message' className={`form-control mb-0 ${errors.message ? "is-invalid" : ""}`} defaultValue={""} />
              {errors.message && <div className='invalid-feedback'>{errors.message.message}</div>}
            </div>
          </Col>
          <Col xl={4} lg={5} xs={8}>
            <Button className='btn-solid'>Send Message</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ContactForm;
