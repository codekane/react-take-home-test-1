import React, { FC } from 'react';
import { useEffect, useState } from 'react';
import { apiFetchAllContacts, apiDeleteContact, IContact } from "../data/contacts"
import { ContactModal } from './modal';

export const Contacts: FC = () => {
  const [contactList, setContactList] = useState<IContact[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [modalContact, setModalContact] = useState<null | IContact>(null);
  const [modalMode, setModalMode] = useState("Add");
  const [updated, setUpdated] = useState(false);


  useEffect(() => {
    apiFetchAllContacts().then((response: IContact[]) => {
      setContactList(response);
      setUpdated(false);
    }).catch(
      (err) => console.log(err)
    );

  }, [updated]);

  const flagRefresh = () => { setUpdated(true); }
  
  const addContact = () => {
    setModalContact(null);
    setModalMode("Add");
    setShowModal(true);
  }

  const editContact:any = (contact: IContact) => {
    setModalContact(contact);
    setModalMode("Edit");
    setShowModal(true);
  }

  const deleteContact:any = (id:string) => {
    apiDeleteContact(id).then( (val) => {
      console.log("Successfully deleted contact.");
      flagRefresh()
    }, (err) => {
      console.log("Failed to delete contact");
      console.log(err);
    })
  }

  return (
    <>
      <button className="open-add-contact-modal" onClick={addContact} >Add Contact</button>
      <ContactModal show={showModal} mode={modalMode} contact={modalContact} onClose={() => setShowModal(false)} updated={flagRefresh}></ContactModal>
      <table data-testid="contacts-list" className="contact-list">
        <thead>
          <tr>
          <th>Name</th>
          <th>Phone Number</th>
          <th>Email</th>
          <th>Age</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
          {contactList.map((contact: IContact) =>  (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.phone}</td>
                <td>{contact.email}</td>
                <td>{contact.age}</td>
                <td>
                  <button onClick={() => { editContact(contact) }}>Edit</button>
                  <button onClick={() => { deleteContact(contact.id) }}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>

      </table>

    </>

  );
}
