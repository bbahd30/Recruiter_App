import React, { useEffect, useState } from 'react';
import * as Links from '../../Links';
import axios from 'axios';
import FormProvider from '../UtilityComponents/FormProvider';

const AddQuestionForm = (props) =>
{
    const initial =
    {
        section_name: "",
        weightage: "",
        round_id: props.round_id
    };

    const model = 'sections';

    const { MyForm, MyTextField, MySelectField } = FormProvider(initial, model);

    const [rounds, setRounds] = useState([]);
    useEffect(() =>
    {
        const url = Links.rounds_api;
        axios
            .get
            (
                url
            )
            .then
            ((response) =>
            {
                if (response.status === 200 || response.status === 201)
                {
                    setRounds(response.data)
                }
            })
            .catch((error) =>
            {
                console.log(error);
            });
    }, []);

    return (
        <MyForm>
            <MyTextField field="section_name" />
            <MyTextField field="weightage" />
        </MyForm>
    );
};

export default AddQuestionForm;