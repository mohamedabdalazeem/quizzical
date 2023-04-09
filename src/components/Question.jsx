import { useEffect, useState } from "react"
import wrongImg from "../assets/cross.png"
import correctImg from "../assets/check-mark.png"

export default function Question({id, question, correctAnswer, choices, onUpdate, checkAnswer}) {
    const [selectedChoice, setSelectedChoice] = useState(null)
    const [selectedEl, setSelectedEl] = useState(null)
    const [markImgSrc, setMarkImgSrc] = useState(null)


    useEffect(() => {
       onUpdate({id, selectedChoice})
       checkAnswers()
    },[selectedChoice,checkAnswer])
    
    function checkAnswers() {
        if(!checkAnswer){
            return
        }
        if(selectedChoice === correctAnswer){
            selectedEl.className = 'correct-answer'
            setMarkImgSrc(correctImg)
        }else{
            selectedEl.className = 'wrong-answer'
            setMarkImgSrc(wrongImg)
        }
        for(let i =1 ;i<5 ; i++){
                   const qEl = document.getElementById(id+i)
                   qEl.disabled = true
                   if(qEl.value === correctAnswer && selectedChoice != correctAnswer){
                    qEl.className = 'correct-choice'
                   }
                }
    }

    const handleSelectedAnswer = (event) => {
        setSelectedChoice(event.target.value)
        setSelectedEl(event.target)  
    }

    return(
        <div className="question-container">
            <div className="q-flex-container">
                <div>
                    <h3 className="question-heading">{question}</h3>
                    <div className="answer">
                        <input type="radio" onChange={handleSelectedAnswer} id={id + 1} value={choices[0]} name={id}/>
                        <label htmlFor={id + 1} >{choices[0]}</label>

                        <input type="radio" onChange={handleSelectedAnswer} id={id + 2} value={choices[1]} name={id}/>
                        <label htmlFor={id + 2}>{choices[1]}</label>

                        <input type="radio" onChange={handleSelectedAnswer} id={id + 3} value={choices[2]} name={id}/>
                        <label htmlFor={id + 3}>{choices[2]}</label>

                        <input type="radio" onChange={handleSelectedAnswer} id={id + 4} value={choices[3]} name={id}/>
                        <label htmlFor={id + 4}>{choices[3]}</label>
                     </div>
                </div>
                {checkAnswer && <img src={markImgSrc} alt="correct mark" className="markImg"/> }
            </div>
            <hr></hr>
        </div>
    )
}
