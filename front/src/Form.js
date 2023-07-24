import axios from 'axios'
import { useState } from 'react'

const Form = () => {
    const [argumentNames, setArgumentNames] = useState(
        ['Первое слагаемое:', 'Второе слагаемое:']
      )
      const [formData, setFormData] = useState({
        operation: 'sum',
        num1: 0,
        num2: 0
      })
    
      const [result, setResult] = useState(0)
    
      const change = (e) => {
        setFormData({...formData, operation: e.target.value})
        switch (e.target.value) {
          case 'sum':
            setArgumentNames(['Первое слагаемое:', 'Второе слагаемое:'])
            break
          case 'multiply':
            setArgumentNames(['Первый множитель:', 'Второй множитель:'])
            break
          default:
            setArgumentNames(['Первое слагаемое:', 'Второе слагаемое:'])
            break
        }
      }
    
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    
      const submit = async (e) => {
        e.preventDefault()
        const response = await axios.post('http://localhost:5000/execute', JSON.stringify(formData), config)
        console.log(response)
        setResult(response.data.result)
      }
    
      return (
        <div className="App">
          <div className='wrapper'>
            <form onSubmit={e => submit(e)}>
              <select onChange={change}>
                <option value='sum'>Сумма</option>
                <option value='multiply'>Произведение</option>
              </select><br />
              <label htmlFor='num1'>{argumentNames[0]}</label><br />
              <input name='num1' value={formData.num1} onChange={(e) => {setFormData({...formData, num1: e.target.value})}} /><br />
              <label htmlFor='num2'>{argumentNames[1]}</label><br />
              <input name='num2' value={formData.num2} onChange={(e) => {setFormData({...formData, num2: e.target.value})}} /><br />
              <input type='submit' value='Получить результат' /><br />
              <label htmlFor='result'>Результат: </label><br />
              <input name='result' type="text" readOnly value={result}></input>
            </form>
          </div>
        </div>
      )
}

export default Form