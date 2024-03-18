import React, { useState, useRef } from 'react'

const FileUploader = () => {
  const fileInput = useRef<HTMLFormElement | null>( null )
  const [ dragging, setDragging ] = useState( false )

  const handleSubmit = ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault()
    e.stopPropagation()
    const file = ( e.target as HTMLFormElement ).files[0]
    console.log( file )
  }

  const handleDrag = ( e: React.DragEvent<HTMLFormElement> | React.DragEvent<HTMLDivElement> ) => {
    e.preventDefault()
    e.stopPropagation()
    if( e.type === 'dragenter' || e.type === 'dragover' ) {
      setDragging( true )
    } else if( e.type === 'dragleave' ) {
      setDragging( false )
    }
  }

  const handleDrop = ( e: React.DragEvent<HTMLDivElement> ) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging( false )
    if( e.dataTransfer.files && e.dataTransfer.files.length > 0 ) {
      const file = e.dataTransfer.files[0]
      console.log( file )
    }
  }

  const onChangeFile = ( e: React.ChangeEvent<HTMLInputElement> ) => {
    e.preventDefault()
    if( e.target.files && e.target.files.length > 0 ) {
      const file = e.target.files[0]
      console.log( file )
    }
  }

  const onClick = () => {
    if( fileInput.current ) {
      fileInput.current.click()
    }
  }

  return (
    <form id="file-upload-form" ref={ fileInput } onDragEnter={ handleDrag } onSubmit={ handleSubmit }>
      <input type="file" id="file-upload" onChange={ onChangeFile }/>
      <label id="file-upload-label" htmlFor="file-upload" className={ dragging ? 'drag-active' : '' }>
        <div>
          <p>Drag and drop a file here or</p>
          <button className="upload-button" onClick={ onClick }>Upload a file</button>
        </div>
      </label>
      { dragging && <div id="drag-file-element" onDragEnter={ handleDrag } onDragOver={ handleDrag } onDragLeave={ handleDrag } onDrop={ handleDrop }></div> }
    </form>
  )
}

export default FileUploader