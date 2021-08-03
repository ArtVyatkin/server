import Footer from 'components/Footer'
import Header from "components/Header";
import Container from "components/Container"
import Modal from "./Modal";
import {createContext, useState} from "react";

const defaultContext = {
    modal: {
        active: false,
        title: 'Info',
        content: <div>Sample</div>,
        footer: ''
    }
}

export const ApplicationContext = createContext(defaultContext);

export default function ABSApplication() {
    const [context, updateContext] = useState(defaultContext);
    let headerContext = {
        updatePage: () => {
        }
    };
    return (<ApplicationContext.Provider value={{context, updateContext}}>
        <Header context={headerContext}/>
        <Container header={headerContext}/>
        <Footer/>
        <Modal/>
    </ApplicationContext.Provider>);
};


