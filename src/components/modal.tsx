import React, { FC, useState, useEffect } from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';
import { collapseTextChangeRangesAcrossMultipleVersions, getAutomaticTypeDirectiveNames, setConstantValue, updateDecorator } from 'typescript';
import { IContact, apiAddContact, apiUpdateContact } from "../data/contacts";
import { generateUUID } from "../util/guid";


interface ModalProps {
    show: boolean;
    mode: string;
    contact: IContact | null;
    onClose(): void;
    updated(): void;
}

export const ContactModal: FC<ModalProps> = ({ show, mode, contact, onClose, updated }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState(0);
    const [id, setId] = useState('');
    const [modalMode, setModalMode] = useState(mode);

    useEffect(() => {
        console.log("Modal UseEffect Triggered");
        if (contact) {
            setName(contact.name);
            if (contact.phone) { setPhone(contact.phone); }
            if (contact.age) { setAge(contact.age); }
            if (contact.email) { setEmail(contact.email); }
        }
        setModalMode(mode);

    }, [contact, mode])

    if (!show) { return null }

    const clearForm = () => {
        console.log("Form Clear");
        setName('');
        setPhone('');
        setEmail('');
        setAge(0);
        setId('');
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (mode == "Add") {

            let newContact: IContact = {
                id: generateUUID(),
                name: name
            }
            if (phone) { newContact.phone = phone };
            if (age != 0) { newContact.age = age };
            if (email) { newContact.email = email };

            console.log(newContact);
            apiAddContact(newContact).then((val) => {
                console.log("Successfully added contact!")
                updated();
                clearForm();
                onClose();
            }, (err) => {
                console.log("Failed to add contact");
                console.log(err);
                alert(err);
            })
        } else if (mode == "Edit") {
            if (contact) {
                let updatedContact = { ...contact };
                updatedContact.name = name;
                if (phone) { updatedContact.phone = phone };
                if (age) { updatedContact.age = age };
                if (email) { updatedContact.email = email };

                apiUpdateContact(updatedContact).then((val) => {
                    console.log("Successfully updated contact!");
                    updated();
                    clearForm();
                    onClose();
                }, (err) => {
                    console.log("Failed to update contact");
                    console.log(err);
                    alert(err);
                })

            }
        }
    }

    return (
        <div className="modal" data-testid="contacts-modal" onClick={() => { clearForm(); onClose(); }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="modal-title text-center">{mode} Contact</h4>
                </div>

                <form id="contact-form">
                    <div className="modal-body">
                        <label>
                            Name:
                            <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </label>

                        <label>
                            Phone Number:
                            <input type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </label>

                        <label>
                            Email:
                            <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>

                        <label>
                            Age:
                            <input type="number" id="number" name="number" value={age} onChange={(e) => setAge(parseInt(e.target.value))} />
                        </label>
                    </div>

                    <div className="modal-footer">
                        <button className="button" onClick={onClose}>Cancel</button>
                        <button type="button" onClick={handleSubmit} className="button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
