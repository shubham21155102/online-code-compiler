import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Editor from '@monaco-editor/react';
import cpp from "./image/cpp.png"
import python from "./image/python.png"
import { Hourglass, MagnifyingGlass, Watch } from 'react-loader-spinner'
const samples = {
  cpp: `#include <iostream>
using namespace std;
int main() {
    cout << "Hello Shubham";
    return 0;
}`,
python: `# python3
print("Hello Shubham !!!")`,
c: `#include <stdio.h>
int main() {
        printf("Hello Shubham !!!");
        return 0;
}`,
    java: `class Main {
        public static void main(String[] args) {
            System.out.println("Hello Shubham !!!");
        }
    }`,

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
    const [language, setLanguage] = useState("cpp");
    const [code, setCode] = useState(samples[language]);
    const [input, setInput] = useState("// enter input here");
    const [output, setOutput] = useState("");
    const [editorMode, setEditorMode] = useState("vs-dark");
    const [status, setStatus] = useState("");
    const [jobId, setJobId] = useState("");
    const [jobDetails, setJobDetails] = useState(null);
    const [languageIcon, setLanguageIcon] = useState(language);
    const [outButtonClicked, setOutButtonClicked] = useState(false);
    const stubs = {
        python: samples["python"],
        cpp: samples["cpp"],
    };
    useEffect(()=>{
        const localStorageCode=localStorage.getItem("code");
        if(localStorageCode){
            setCode(localStorageCode);
        }
        else{
            setCode(samples[language]);
        }
        
        setOutput("//output")
        setLanguageIcon(language)
    },[language])
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
        localStorage.setItem("code",code);
        setStatus("running")
        setOutButtonClicked(true);
        const res= await fetch("https://api.shubhamiitbhu.in/code/run-code",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            code:code,
            submittedBy:"uysfjgbc",
            questionId:"fwgradhts",
            language:language
          })
        })
        const data=await res.json();
        console.log(data);
        setOutput(data.output);
        setOutButtonClicked(false);
        console.log(output)
    }
    return (
        <>
            <div id='App' className='App-dark'>
                <div id='header' className='header-dark'>
                    <h3 id="app-name" className="app-name-dark">
                        <i className="fas fa-solid fa-cube" aria-hidden="true"></i>
                        {/* &nbsp; Online Code Runner */}
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
 src={`/${language}.png`}
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
                            setCode(stubs[e.target.value]);``
                            setLanguageIcon(`./resources/${language}.png`);
                        }}
                    >
                        <option value={"python"}>Python</option> 
                        <option value={"c"}>C</option>
                        <option value={"cpp"}>C++</option>
                        <option value={"java"}>Java</option>
                    </select>
                </button>
                <button className="btn run-btn" 
                onClick={handleSubmit}
                >
                    <i
                        className="fas fa-play fa-fade run-icon"
                        aria-hidden="true"
                    ></i>
                    {outButtonClicked ? <Hourglass color="white" height={20} width={20} /> : <>&nbsp; Run</>}
                </button>
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
                <div className="std-output">
                {outButtonClicked ? <MagnifyingGlass
  visible={true}
  height="80"
  width="80"
  ariaLabel="magnifying-glass-loading"
  wrapperStyle={{}}
  wrapperClass="magnifying-glass-wrapper"
  glassColor="#c0efff"
  color="#e15b64"
  /> : <> <Editor
                        height="100%"
                        width="100%"
                        theme={editorMode}
                        defaultLanguage="plaintext"
                        defaultValue={"// output"}
                        value={output}
                        options={outputOptions}
                    /></>}
                   
                </div>
            </div>
            </div>
           
                
        </>
    )
}

export default Index
