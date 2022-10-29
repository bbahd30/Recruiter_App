import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../DashboardComponents/SideBar';
import { useLocation } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import CarouselProvider from '../UtilityComponents/CarouselProvider';
import AddTestForm from '../Forms/AddTestForm';
import axios from 'axios';
import * as Links from '../../Links';
import { borderLeft } from '@mui/system';

const TestOfRound = () =>
{
    const location = useLocation();
    // todo: on using history if just typed then will not get the seasonID as no history and direct landed
    const seasonID = location.state.sId;

    const [sections, setSections] = useState([]);
    const roundId = useParams();
    const [sectionsToShowArr, setArray] = useState([]);
    const [questions, setQuestions] = useState([]);
    const fetchTest = () =>
    {
        axios
            .get(Links.rounds_api + `${roundId.id}/sections/`)
            .then((response) =>
            {
                setSections(response.data);
                sections.map(section =>
                (
                    setArray(sectionsToShowArr => [...sectionsToShowArr, section.id])
                ))
            })
            .catch((error) =>
            {
                console.log(error);
            });
    }

    const fetchQuestions = () =>
    {
        axios
            .get(Links.rounds_api + `${roundId.id}/sections/`)
            .then((response) =>
            {

            })
            .catch((error) =>
            {
                console.log(error);
            });
    }

    // const setSectionsToShow = () =>
    // {
    //     sections.map(section =>
    //     (
    //         setArray(sectionsToShowArr => [...sectionsToShowArr, section.id])
    //     ))
    // }
    useEffect(() =>
    {
        fetchTest();
        console.log(sectionsToShowArr)
    }, [])


    const divStyle =
    {
        padding: '10px 20px',
        width: '75%',
        borderRadius: '8px 2px 2px 8px',
        margin: '20px auto',
    }
    return (
        <>
            <SideBar id={seasonID} />
            <Box>
                {
                    sections.map(section =>
                    (
                        <Accordion
                            key={section.id}
                            style={divStyle}
                            className='section-boxes'
                        >
                            <AccordionSummary >
                                <h2>
                                    Section: {section.section_name}
                                    {/* todo: add accordion condtion of only one open at once */}
                                </h2>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {sectionsToShowArr} sec
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))
                }

            </Box>
        </ >
    );
};

export default TestOfRound;