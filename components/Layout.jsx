import React from 'react'

export default (props) =>
    <div className='root'>
        <div className='container'>
            {props.children}
        </div>
        <style jsx>{`
            .root {
                align-items: center;
                background-color: black;
                display: flex;
                font-family: sans-serif;
                height: 100vh;
                justify-content: center;
                width: 100vw;
            }
            .container {
                display: flex;
                min-height: 400px;
                min-width: 375px;
            }
        `}</style>
    </div>
