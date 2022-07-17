import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap'
import styled from 'styled-components'
import axios from 'axios'

interface modalProps {
  text: String
  variant: 'primary' | 'danger'
  isSignupFlow: boolean
}
const ModalComponent = ({ text, variant, isSignupFlow }: modalProps) => {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const navigate = useNavigate()

  const ErrorMessage = styled.p`
    color: red;
  `

  const handleClick = async () => {
    let response

    if (isSignupFlow) {
      const { data: signupData } = await axios.post(
        'http://localhost:8080/api/auth/signup',
        { email, password }
      )
      response = signupData
      console.log(signupData)
      console.log(signupData.data.token)
    } else {
      const { data: loginData } = await axios.post(
        'http://localhost:8080/api/auth/login',
        { email, password }
      )
      response = loginData
      console.log(loginData)
      console.log(loginData.data.token)
    }
    if (response.errors.length) {
      return setErrorMsg(response.errors[0].msg)
    }
    // push token into the local storage
    localStorage.setItem('token', response.data.token)
    navigate('/articles')
  }

  return (
    <>
      <Button
        onClick={handleShow}
        variant={variant}
        size='lg'
        style={{ marginRight: '1rem', padding: '0.5rem 3rem' }}
      >
        {text}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{text}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className='mb-3'>
            <InputGroup.Text>Email</InputGroup.Text>
            <FormControl
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>
          <InputGroup className='mb-3'>
            <InputGroup.Text>Password</InputGroup.Text>
            <FormControl
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>
          {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleClick}>
            {text}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModalComponent
