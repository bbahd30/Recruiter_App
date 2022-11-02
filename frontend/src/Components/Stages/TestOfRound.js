import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../DashboardComponents/SideBar';
import { useLocation } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';
import AddSectionForm from '../Forms/AddSectionForm';
import axios from 'axios';
import * as Links from '../../Links';
import MyDialogBox from '../UtilityComponents/MyDialogBox';
import AddQuestionForm from '../Forms/AddQuestionForm';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import EditFunction from '../UtilityComponents/EditFunction';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

const TestOfRound = () =>
{
    const [dataToEdit, setDataToEdit] = useState([]);
    const model = 'questions';


    const location = useLocation();
    // todo: on using history if just typed then will not get the seasonID as no history and direct landed
    const seasonID = location.state.sId;
    const [sections, setSections] = useState([]);
    const roundId = useParams();
    const [questions, setQuestions] = useState([]);

    const [sectionsToShowIDs, setSectionsToShowIDs] = useState([]);

    const fetchTest = () =>
    {
        axios
            .get(Links.rounds_api + `${roundId.id}/sections/`)
            .then((response) =>
            {
                setSections(response.data);
                const len = response.data.length;
                for (let i = 0; i < len; i++)
                {
                    if (sectionsToShowIDs.indexOf(response.data[i].id) === -1)
                    {
                        setSectionsToShowIDs(sectionsToShowIDs => sectionsToShowIDs.concat(response.data[i].id))
                    }
                }
            })
            .catch((error) =>
            {
                console.log(error);
            });
    }

    const fetchQuestions = () =>
    {
        sectionsToShowIDs.map(sectionID =>
        (
            axios
                .get(Links.sections_api + `${sectionID}/questions/`)
                .then((response) =>
                {
                    for (let i = 0; i < response.data.length; i++)
                    {
                        if (!questions.some((question) => (question.id === response.data[i].id)))
                        {
                            setQuestions(questions => questions.concat(response.data[i]))

                            // todo:
                            console.log("added " + response.data[i].question_text)
                        }
                    }
                })
                .catch((error) =>
                {
                    console.log(error);
                })
        ))
    }

    const fetchPrevData = (question_id) =>
    {
        const url = `${Links.questions_api}/${question_id}/`;
        axios
            .get(url)
            .then((response) =>
            {
                setDataToEdit(response.data)
                console.log(dataToEdit)

            })
            .catch((error) =>
            {
                console.log(error);
            })
    }

    // const { MyForm, MyTextField, MySelectField } = EditFunction(dataToEdit, model)
    useEffect(() =>
    {
        fetchPrevData();
    }, []);

    useEffect(() =>
    {
        fetchTest();
        fetchQuestions();
    }, [sectionsToShowIDs])

    const divStyle =
    {
        padding: '10px 20px',
        width: '50%',
        borderRadius: '8px 2px 2px 8px',
        margin: '20px auto',
    }
    const innerDivStyle =
    {
        borderLeft: '3px solid var(--green)',
        margin: '10px auto',
    }
    const quesData =
    {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
    }
    return (
        <>
            <SideBar id={seasonID} />
            <Box>
                <h1 className='addSection'>Sections</h1>
                <div className='addSection'>
                    <MyDialogBox
                        buttonChild=
                        {
                            "Add Sections"
                        }
                        dataChild=
                        {
                            // todo: for edit
                            <AddSectionForm round_id={roundId} type='add' section_id="" />
                            // AddSectionForm({ round_id: roundId })
                        }
                        title="Add Sections"
                    />
                </div>
                <div>
                    {
                        sections.map(section =>
                        (
                            <div
                                key={section.id}
                                style={divStyle}
                                className='section-boxes'
                            >
                                <div >
                                    <div className='flexClass'>
                                        <h2>
                                            Section: {section.section_name}
                                            {/* todo: add accordion condtion of only one open at once */}
                                        </h2>
                                        <div className='addSign'>
                                            <MyDialogBox

                                                buttonChild=
                                                {
                                                    <ControlPointIcon />
                                                }
                                                dataChild=
                                                {
                                                    <AddQuestionForm sectionID={section.id}
                                                        type='add'
                                                    />
                                                }
                                                title="Add Questions"
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div>
                                    <>

                                        {
                                            questions.map(question =>
                                            (
                                                // (question.section_id.indexOf(section.id) != -1) ?
                                                (question.section_id == section.id) ?
                                                    <div key={question.id}>
                                                        <MyDialogBox

                                                            buttonChild=
                                                            {
                                                                <ModeEditIcon />
                                                            }
                                                            dataChild=
                                                            {
                                                                // <EditFunction model="questions" section_id={question.id} />
                                                                <>
                                                                    <AddQuestionForm type='edit' question_id={question.id} />
                                                                    {/* <MyForm>
                                                                                                <MyTextField field="question_text" />
                                                                                                <MyTextField field="total_marks" />
                                                                                                <MySelectField field='assignee_id' data={members} />
                                                                                                <MyTextField field="ans" />

                                                                                            </MyForm> */}

                                                                </>
                                                            }
                                                            title="Edit Question"
                                                        />
                                                        <Accordion
                                                            style={innerDivStyle}
                                                            className='section-boxes'
                                                        >
                                                            <AccordionSummary>
                                                                <div className='questionAcc'>
                                                                    <div>
                                                                        {question.question_text}
                                                                    </div>
                                                                    <div id='questionMarks'>
                                                                        <div>
                                                                            {question.total_marks}
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <>
                                                                    {
                                                                        question.assignee_id.map
                                                                            ((assignee) =>
                                                                            (
                                                                                <div
                                                                                    style={quesData}
                                                                                    key={assignee.id}>
                                                                                    <div>
                                                                                        {assignee.name}
                                                                                    </div>

                                                                                </div>
                                                                            ))
                                                                    }
                                                                </>

                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div> : ("")
                                            ))

                                        }

                                    </>
                                </div>
                            </div>

                        ))
                    }
                </div>


            </Box>
        </ >
    );
};

export default TestOfRound;