import React, { useState } from 'react';
import Loader from '../Common/Loader';
import './User.css';

const CreatePlante = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [plante, setPlante] = useState({
        nom_plante: "",
        description: "",
        variete: "",
        url_photo1: "",
        url_photo2: "",
        url_photo3: "",
    });
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [submissionDate, setSubmissionDate] = useState(""); // État pour stocker la date de soumission

    const handleInput = (event) => {
        const { name, value } = event.target;
        setPlante({ ...plante, [name]: value });
    };

    const handleDateInput = (event) => {
        const { name, value } = event.target;
        if (name === "dateDebut") {
            setDateDebut(value);
        } else if (name === "dateFin") {
            setDateFin(value);
        }
    };

    const handleFileInput = (event) => {
        const { name, files } = event.target;
        if (files.length > 0) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            setPlante({ ...plante, [name]: url });
        }
    };

    const isLoggedIn = localStorage.getItem('token') !== null;

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const id_utilisateur = localStorage.getItem('id_utilisateur');
            const currentDate = new Date().toISOString();

            // Mettre à jour la date de soumission dans l'état
            setSubmissionDate(currentDate);

            // Ajouter la date de soumission et l'utilisateur à l'objet plante
            const planteData = {
                ...plante,
                creele: currentDate,
                utilisateur: {
                    id_utilisateur: id_utilisateur
                }
            };
            const role = localStorage.getItem('role');
            console.log(role)
            const reservationData = {
                dateDebut: dateDebut,
                dateFin: dateFin,
                etat: 0
            };

            const reservationResponse = await fetch("http://localhost:8080/reservations", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reservationData),
            });

            if (!reservationResponse.ok) {
                console.error('Échec de l\'enregistrement de la réservation');
                return;
            }

            const reservationResult = await reservationResponse.json();
            const id_reservation = reservationResult.id_reservation;

            console.log(planteData);
            const response = await fetch("http://localhost:8080/plantes", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...planteData, reservation: { id_reservation } }),
            });

            if (response.ok) {
                console.log("Plante enregistrée avec succès");
                setPlante({ nom_plante: "", description: "", variete: "", url_photo1: "", url_photo2: "", url_photo3: "" });
            } else {
                console.error('Échec de l\'enregistrement de la plante');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='user-form'>
            <div className='heading'>
                {isLoading && <Loader />}
                {error && <p>Error: {error}</p>}
                <p>Créer une plante</p>
            </div>

            {isLoggedIn ? (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nom_plante" className="form-label">Nom plante</label>
                        <input type="text" className="form-control" id="nom_plante" name="nom_plante" value={plante.nom_plante} onChange={handleInput} />
                    </div>
                    <div className="mb-3 mt-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name="description" value={plante.description} onChange={handleInput} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="variete" className="form-label">Variete</label>
                        <input type="text" className="form-control" id="variete" name="variete" value={plante.variete} onChange={handleInput} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="url_photo1" className="form-label">Image</label>
                        <input type="file" className="form-control" id="url_photo1" name="url_photo1" onChange={handleFileInput} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="url_photo2" className="form-label">Image 2</label>
                        <input type="file" className="form-control" id="url_photo2" name="url_photo2" onChange={handleFileInput} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="url_photo3" className="form-label">Image 3</label>
                        <input type="file" className="form-control" id="url_photo3" name="url_photo3" onChange={handleFileInput} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dateDebut" className="form-label">Date de début</label>
                        <input type="date" className="form-control" id="dateDebut" name="dateDebut" value={dateDebut} onChange={handleDateInput} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dateFin" className="form-label">Date de fin</label>
                        <input type="date" className="form-control" id="dateFin" name="dateFin" value={dateFin} onChange={handleDateInput} />
                    </div>
                    <button type="submit" className="btn btn-primary submit-btn">Submit</button>
                </form>
            ) : (
                <p>Veuillez vous connecter</p>
            )}
        </div>
    );
};

export default CreatePlante;
