import React from 'react';
import MaskedInput from 'react-text-mask';

export default function (props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      mask={[/\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask
      guide={false}
    />
  );
}
