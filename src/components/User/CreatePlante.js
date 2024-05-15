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
    })
    const [submissionDate, setSubmissionDate] = useState(""); // État pour stocker la date de soumission


    const handelInput = (event) => {
        const { name, value } = event.target;
        setPlante({ ...plante, [name]: value });
    }

    const isLoggedIn = localStorage.getItem('token') == !null;
    const isNotLoggedIn = localStorage.getItem('token') == null;

    const handelSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const currentDate = new Date().toISOString();

            // Mettre à jour la date de soumission dans l'état
            setSubmissionDate(currentDate);

            // Ajouter la date de soumission à l'objet plante
            const planteData = {
                ...plante,
                id_utilisateur: 1,
                creele: currentDate
            };
            console.log(planteData)
            const response = await fetch("http://localhost:8080/plantes", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(planteData),
            });

            if (response.ok) {
                console.log("plante enregistré avec succès");
                setPlante({ nom_plante: "", description: "", variete: "" });
            } else {
                console.error('Échec de l\'enregistrement de la plante');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className='user-form'>
            <div className='heading'>
                {isLoading && <Loader />}
                {error && <p>Error: {error}</p>}
                <p>Créer une plante</p>
            </div>
            {isNotLoggedIn && <h5> Veuillez vous connecter pour créer une plante</h5>}
            {isLoggedIn && <form onSubmit={handelSubmit}>

                <div className="mb-3">
                    <label for="nom_plante" className="form-label">nom plante</label>
                    <input type="text" className="form-control" id="nom_plante" name="nom_plante" value={plante.nom_plante} onChange={handelInput} />
                </div>
                <div className="mb-3 mt-3">
                    <label for="description" className="form-label">description</label>
                    <input type="text" className="form-control" id="description" name="description" value={plante.description} onChange={handelInput} />
                </div>
                <div className="mb-3">
                    <label for="variete" className="form-label">variete</label>
                    <input type="text" className="form-control" id="variete" name="variete" value={plante.variete} onChange={handelInput} />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input type="file" className="form-control" id="url_photo1" name="url_photo1" onChange={handelInput} />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image 2</label>
                    <input type="file" className="form-control" id="url_photo2" name="url_photo2" onChange={handelInput} />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image 3</label>
                    <input type="file" className="form-control" id="url_photo3" name="url_photo3" onChange={handelInput} />
                </div>

                <button type="submit" className="btn btn-primary submit-btn">Submit</button>
            </form>
            }
        </div>
    )
}

export default CreatePlante