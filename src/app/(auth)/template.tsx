import React from 'react'


interface TemplateProps{
    children:React.ReactNode
}
const Template:React.FC<TemplateProps> = ({children}) => {
  return (
    <div className='h-screen flex p-6 justify-center'>
      {children}
    </div>
  )
}

export default Template
