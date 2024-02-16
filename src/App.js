import { Col, Container, Row } from "reactstrap";
import "./App.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { FaExchangeAlt } from "react-icons/fa";
import Select from 'react-select';
import toast, { Toaster } from "react-hot-toast";


function App() {
  const [values, setValues] = useState({
    from: "1",
    from_cur: "",
    from_prev: "",
    to: "",
    to_cur: "",
    to_prev: "",
    converted: ""
  })

  const [isLoading, setIsLoading] = useState(false)

  const [currOptions, setCurrOptions] = useState([])

  const getCountries = async () => {
    setIsLoading(true)
    // This function gets list of all the currencies in the required format
    try {
      const countries = await axios({
        method: "GET",
        url: `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json`
      })

      const options = []

      Object.entries(countries.data).forEach(([key, value]) => {
        options.push({ label: `${value} (${key.toUpperCase()})`, value: key })
      })

      setCurrOptions([...options])
      console.log({ countries })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConvert = async () => {
    // This function checks if all fields are filled then sets the data in the "values" state
    if (values.from === "" || values.from_cur === "" || values.to_cur === "") {
      toast.error("Fill all fields")
      return
    }
    try {
      const { data } = await axios({
        method: "GET",
        url: `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${values.from_cur.toLowerCase()}.json`
      })
      setValues({ ...values, to: data[values.from_cur.toLowerCase()][values.to_cur.toLowerCase()], from_prev: values.from_cur, to_prev: values.to_cur })
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  useEffect(() => {
    getCountries()
  }, [])
  return (
    <div className="p-2 p-md-5">
      <Container className="p-3 p-md-5" style={{ backgroundColor: "#f0f1f2" }}>
        <Row >
          <Col className="mb-5" md={12}>
            <h3 className="text-center text-black fs-1 fw-bold pacifico-regular">Currency Convertor</h3>
          </Col>
          <Col className="mb-md-0 mb-5" md={4}>
            <label className="mb-3 text-success" htmlFor="from">Amount</label>
            <input value={values.from} onChange={e => setValues({ ...values, from: parseFloat(e.target.value) >= 1 || e.target.value === "" ? e.target.value : values.from })} id="amount" type="number" className="form-control mb-3" />
          </Col>
          <Col className="mb-md-0 mb-5" md={3} sm={5}>
            <label className="mb-3 text-success" htmlFor="from">From</label>
            <Select isLoading={isLoading} onChange={e => setValues({ ...values, from_cur: e.value, from_prev: values.from_prev === "" ? e.value : values.from_prev })} value={currOptions.filter($ => $.value === values.from_cur)} options={currOptions} />
          </Col>
          <Col sm={2}>
            <div className="d-flex justify-content-center align-items-center p-3">
              <button onClick={() => {
                // This function interchanges toe currency fields' data
                setValues({
                  ...values,
                  to_cur: values.from_cur,
                  from_cur: values.to_cur
                })
              }} style={{ width: "50px", aspectRatio: "1" }} className="btn btn-sm border-success text-success bg-opacity-50 bg-success d-flex align-items-center justify-content-center rounded-circle">
                <FaExchangeAlt />
              </button>
            </div>
          </Col>
          <Col className="mb-md-0 mb-3" md={3} sm={5}>
            <label className="mb-3 text-success" htmlFor="to">To</label>
            <Select isLoading={isLoading} onChange={e => setValues({ ...values, to_cur: e.value, to_prev: values.to_prev === "" ? e.value : values.to_prev })} value={currOptions.filter($ => $.value === values.to_cur)} options={currOptions} />
          </Col>
          <Col md={12} className="mb-5">
            <button onClick={handleConvert} className="btn btn-sm border-success text-success bg-opacity-50 bg-success">Convert</button>
          </Col>
          <Col md={12}>
            <p className="fw-bolder mb-3">Converted Amount:</p>
            {(values.to !== "" && values.to_cur !== "" && values.from !== "") && <>
              {values.from} {values.from_prev.toUpperCase()} = {parseFloat(values.from) * parseFloat(values.to)} {values.to_prev.toUpperCase()}
            </>}
          </Col>
        </Row>
      </Container>
      <Toaster />
    </div>
  )
}

export default App;
