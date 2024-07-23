import React from 'react'

export default function Input({label, type, name, id, ...props }) {
    return (
        <>

            <div>
            <label htmlFor={id} className=' block text-gray-600 text-sm font-medium '>{label}</label>
                <input
                    type={type}
                    name={name}
                    id={id}
                    autoComplete='off'
                    className='w-full   border-b border-gray-300  focus:outline-none focus:border-blue-500 mb-4'
                    {...props}
                />
            </div>


        </>
    )
}
