import { useEffect, useState } from 'react'
import './App.css'
import Question from './components/Question'
import {nanoid} from 'nanoid'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [check, setCheck] = useState(false)

  function startGame() {
    setGameStarted(true)
  }
  
  useEffect(()=> {
    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
    .then((response) => response.json())
    .then((data) => {
      const result = data.results
      let arr=[]
      
       for(let i=0; i<5;i++){
        let answers = []
        for (let choice of result[i].incorrect_answers){
          let refinedChoice = choice.replace(/(&quot\;)/g,"\"")
          refinedChoice = refinedChoice.replace(/(&#039\;)/g, "\'")
          answers.push(refinedChoice)
        }
        let randomIndex = Math.floor(Math.random()*4)
        answers.splice(randomIndex, 0, result[i].correct_answer)
        let question = result[i].question.replace(/(&quot\;)/g,"\"")
        question = question.replace(/(&#039\;)/g, "\'")
        arr.push({
          id:nanoid(),
          question:question,
          choices:answers,
          correctAnswer:result[i].correct_answer,
          chosenAnswer: '',
          checkAnswer:false
        })
       }
       setQuestions(arr)
    })
    .catch((err) => {
      console.log(err.message)
    })
  },[gameStarted])

  
  function restartGame() {
    setGameStarted(false)
    setCheck(false)
    setQuestions(questions.map((question) => ({...question, checkAnswer:false})))
  }
  const handleQuestionUpdate = ({id, selectedChoice}) => {
    setQuestions(questions.map((question) => (
      question.id === id ? {...question, chosenAnswer:selectedChoice}: question
    )))
  }

  const checkAnswers = () => {
    for(let q of questions){
      if(q.chosenAnswer == '' || q.chosenAnswer == null){
        toast.info('please select all choices', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
        return
      }
    }
    setCheck(true)
    setQuestions(questions.map((question) => ({...question, checkAnswer:true})))
  }

  const numberOfCorrectAnswers = questions.reduce((acc, question) => {
    if(question.chosenAnswer === question.correctAnswer){
      acc++
    }
    if(acc == 5){
      toast.success('🦄 Wow so easy!', {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        });
    }
    return acc
  },0)


  return (
    <div className="App">
      <ToastContainer />
      { !gameStarted && 
      <div className='start-section'>
        <h2 className='main-heading'>Quizzical</h2>
        <p className='desc'>Test your knowledge</p>
        <button 
        className='start-btn' 
        onClick={startGame}
        >Start quiz
        </button>
      </div>
      }
      { 
        gameStarted &&
        <div>
          {questions.map((question) => (
            <Question 
            key={question.id}
            id={question.id}
            question={question.question}
            choices={question.choices}
            correctAnswer={question.correctAnswer}
            onUpdate={handleQuestionUpdate}
            checkAnswer={question.checkAnswer}
            />
          ))}
          { !check &&
            <div className={`check-ans`}>
              <button className='check-btn'
              onClick={checkAnswers} 
              >Check Answers</button>
            </div>
          }
        </div>
      }
      {
        check && 
        <div className='check-ans'>
          you got {numberOfCorrectAnswers} answers right!
          <button className='check-btn' onClick={restartGame}>Play again</button>
        </div>

      }
    </div>
  )
}

export default App







