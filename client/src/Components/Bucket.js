import React from "react"
import { useDrop } from "react-dnd"
function Bucket() {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
      // The type (or types) to accept - strings or symbols
      accept: 'BOX',
      // Props to collect
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }))
  
    return (
      <div
        ref={drop}
        role={'Dustbin'}
        style={{ backgroundColor: isOver ? 'red' : 'white' }}
      >
        {canDrop ? 'Release to drop' : 'Drag a box here'}
      </div>
    )
  }