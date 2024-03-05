import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Editor from '@monaco-editor/react';
import cpp from "../../../LandingPage/image/cpp.png"
import python from "../../../LandingPage/image/python.png"
import { Audio, Hourglass, Watch } from 'react-loader-spinner'
const samples = {
  cpp: `#include <bits/stdc++.h>
using namespace std;
int main() {
    cout << "Hello Shubham";
    return 0;
}`,
  python: `# python3
print("Hello Shubham !!!")`,
};
const editorOptions = {
  scrollBeyondLastLine: false,
  fontSize: "14px",
  folding: false,
}
const inputOptions = {
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  fontSize: "14px",
  lineDecorationsWidth: 5,
};
const outputOptions = {
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  fontSize: "14px",
  lineDecorationsWidth: 5,
};
const Index = () => {
  const router = useRouter();
  const { slug, slug1 } = router.query;
  const userId=slug;
  const problemId=slug1;
  const [language, setLanguage] = useState("cpp");
    const [code, setCode] = useState(samples[language]);
    const [input, setInput] = useState("// enter input here");
    const [output, setOutput] = useState("");
    const [editorMode, setEditorMode] = useState("vs-dark");
    const [status, setStatus] = useState("");
    const [outButtonClicked, setOutButtonClicked] = useState(false);
    const [jobId, setJobId] = useState("");
    const [jobDetails, setJobDetails] = useState(null);
    const [languageIcon, setLanguageIcon] = useState(language);
    const stubs = {
        python: samples["python"],
        cpp: samples["cpp"],
    };
    const toggleTheme = (idName) => {
        let currentClassName = document.getElementById(idName).className;
        let newClassName = currentClassName;
        if (currentClassName === idName + "-dark")
            newClassName = idName + "-light";
        else newClassName = idName + "-dark";
        document.getElementById(idName).className = newClassName;
    };
    const handleThemeChange = () => {
        console.log(editorMode);

        if (editorMode === "vs-light") setEditorMode("vs-dark");
        else setEditorMode("vs-light");
        toggleTheme("App");
        toggleTheme("header");
        toggleTheme("app-name");
        toggleTheme("language-button");
        const themeToggler = document.getElementById("theme-icon");
        let classNames = themeToggler.classList;
        if (classNames.contains("theme-icon-light")) {
            classNames.replace("theme-icon-light", "theme-icon-dark");
            classNames.replace("fa-sun", "fa-moon");
        } else {
            classNames.replace("theme-icon-dark", "theme-icon-light");
            classNames.replace("fa-moon", "fa-sun");
        }
    };
    const handleSubmit=async()=>{
        setStatus("running")
        try{
          const res=await fetch("https://api.shubhamiitbhu.in/code",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              code:code,
              submittedBy:userId,
              questionId:problemId,
            })
          })
          const data=await res.json();
          console.log(data);
          alert("Code Submitted Successfully");
        }catch(e){
          console.log(e);
        }
        
    }
    useEffect(() => {
      const fetchSolvedQuestions = async () => {
        try {
          const response = await fetch(
            `https://api.shubhamiitbhu.in/code/get-code-by-question-id-and-user-id`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                user_id: userId,
              },
              body: JSON.stringify({
                userId: userId,
                questionId: problemId,
              }),
            },
          );
          const data = await response.json();
          console.log(data);
          if(data.length>0){
            setCode(data[0].code);
          }
          // setAnswers(data[0].code);
        } catch (error) {
          console.error("Error fetching solved questions:", error);
        }
      };
  
      if (userId) {
        fetchSolvedQuestions();
      }
    }, [userId, slug,slug1,problemId]);
    const codeRunner=async()=>{
      setOutButtonClicked(true);
      const res= await fetch("https://api.shubhamiitbhu.in/code/run-code",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          code:code,
          submittedBy:userId,
          questionId:problemId,
        })
      })
      const data=await res.json();
      console.log(data);
      setOutput(data.output);
      setOutButtonClicked(false);
    }
    useEffect(()=>{
      if(status==="running"){
        codeRunner();
      }
    },[output,outButtonClicked])
  return (
    <>
      <div id='App' className='App-dark'>
                <div id='header' className='header-dark'>
                    <h3 id="app-name" className="app-name-dark">
                        <i className="fas fa-solid fa-cube" aria-hidden="true"></i>
                        &nbsp; Shubham IITBHU
                    </h3>
                    <div className="nav-right-options">
                    <i
                        id="theme-icon"
                        className="fas fa-solid fa-sun fa-2x nav-icons theme-icon-light"
                        aria-hidden="true"
                        onClick={handleThemeChange}
                    ></i>

                    <i
                        className="fas fa-solid fa-swatchbook tutorial-icon nav-icons fa-2x"
                        aria-hidden="true"
                    ></i>
                </div>
                </div>
                <div className="secondary-nav-items">
                <button className="btn logo-btn" disabled={true}>
                <Image
 src={language === "cpp" ? cpp : python}
  width={20}
  height={20}
  className="image"
  alt={`${language} icon`}
/>

                </button>
                <button id="language-button" className="language-button-dark">
                    <select
                        value={language}
                        onChange={(e) => {
                            setStatus("");
                            setJobDetails(null);
                            setLanguage(e.target.value);
                            setCode(stubs[e.target.value]);
                            setLanguageIcon(`./resources/${language}.png`);
                        }}
                    >
                        <option value={"cpp"}>C++</option>
                    </select>
                </button>
                <button className="btn run-btn" 
                onClick={handleSubmit}
                >
                    <i
                        className="fas fa-play fa-fade run-icon"
                        aria-hidden="true"
                    ></i>
                    &nbsp; Submit
                </button>
                {outButtonClicked ?(<>
                  <button className="btn run-btn"
                >
                    <i
                        className="fas fa-play fa-fade run-icon"
                        aria-hidden="true"
                    >
                      <Watch
  visible={true}
  height="28"
  width="28"
  radius="14"
  color="#4fa94d"
  ariaLabel="watch-loading"
  wrapperStyle={{}}
  wrapperClass=""
  />
                    </i>
                   
                </button>
                </>):(<> <button className="btn run-btn"
                onClick={codeRunner}
                >
                    <i
                        className="fas fa-play fa-fade run-icon"
                        aria-hidden="true"
                    ></i>
                    &nbsp; Run
                </button></>)}
               
            </div>    
            <div className="editor">
                <Editor
                    height="100%"
                    width="100%"
                    theme={editorMode}
                    defaultLanguage={language}
                    defaultValue={code}
                    value={code}
                    onChange={(e) => setCode(e)}
                    options={editorOptions}
                    language={language}
                />
            </div>
            <div className="std-input-output">
                <div className="std-input">
                    <Editor
                        height="100%"
                        width="100%"
                        theme={editorMode}
                        defaultLanguage="plaintext"
                        defaultValue={"// enter input here"}
                        value={input}
                        options={inputOptions}
                        onChange={(e) => setInput(e)}
                    />
                </div>
                {
                  outButtonClicked ? (<><Hourglass
  visible={true}
  height="80"
  width="80"
  ariaLabel="hourglass-loading"
  wrapperStyle={{}}
  wrapperClass=""
  colors={['#306cce', '#72a1ed']}
  /></>):(<><div className="std-output">
                    <Editor
                        height="100%"
                        width="100%"
                        theme={editorMode}
                        defaultLanguage="plaintext"
                        defaultValue={"// output"}
                        value={output}
                        options={outputOptions}
                        
                    />
                </div></>)
                }
                
            </div>
            </div>
    </>
  );
};

export default Index;
