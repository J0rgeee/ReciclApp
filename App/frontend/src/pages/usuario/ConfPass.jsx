import React, { useRef } from 'react';
import useForm from 'react-hook-form';

function ConfPass() {
    const { register, errors, handleSubmit, watch } = useForm({});
    const password = useRef({});
    password.current = watch("password", "");
    const onSubmit = async data => {
        alert(JSON.stringify(data));
    };
    return(
        <form onSubmit={e => e.preventDefault()}>
            <label>Contraseña</label>
            <input
                name='password'
                type='password'
                ref={register({
                    required: 'Debe ingresar contraseña',
                    minLength: {
                        value: 8,
                        message: 'Contraseña debe tener 8 caracteres minimo'
                    }
                })}
            />
            {errors.password && <p>{errors.password.current}</p>}

            <label>Re-ingrese contraseña</label>
            <input 
                name='passwordRepeat'
                type='password'
                ref={register({
                    validate: value => 
                        value === password.current || 'Las contraseñas deben ser iguales'
                })}
            />
            {errors.passwordRepeat && <p>{errors.passwordRepeat.message}</p>}
        <input type='submit' onClick={handleSubmit(onSubmit)} />
        </form>
    )
}

export default ConfPass