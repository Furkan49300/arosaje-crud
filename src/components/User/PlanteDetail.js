import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../Common/Loader';
import Modal from 'react-modal'; // Assurez-vous d'installer react-modal
import '../../App.css';

const PlantDetail = () => {
    const { id_plante } = useParams();
    const navigate = useNavigate();
    const [plant, setPlant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedPlant, setUpdatedPlant] = useState({
        nom_plante: "",
        description: "",
        variete: "",
        url_photo1: "",
        url_photo2: "",
        url_photo3: ""
    });

    useEffect(() => {
        const fetchPlantDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`https://arosaje-back.onrender.com/plantes/${id_plante}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des détails de la plante');
                }

                const data = await response.json();
                setPlant(data);
                setUpdatedPlant(data); // Populate the form with existing plant details
            } catch (error) {
                console.error('Error fetching plant details:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlantDetail();
    }, [id_plante]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://arosaje-back.onrender.com/plantes/${id_plante}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de la plante');
            }

            // Rediriger vers la liste des plantes après la suppression
            navigate('/show-my-plante');
        } catch (error) {
            console.error('Error deleting plant:', error);
            setError(error.message);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUpdatedPlant({ ...updatedPlant, [name]: value });
    };

    const handleFileInput = (event) => {
        const { name, files } = event.target;
        if (files.length > 0) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            setUpdatedPlant({ ...updatedPlant, [name]: url });
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://arosaje-back.onrender.com/plantes/${id_plante}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedPlant),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la plante');
            }

            // Fetch the updated plant details
            const data = await response.json();
            setPlant(data);
            setIsModalOpen(false); // Close the modal
        } catch (error) {
            console.error('Error updating plant:', error);
            setError(error.message);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!plant) {
        return <p>Plante non trouvée</p>;
    }

    const dateCreation = new Date(plant.creele);
    const dateAffichee = dateCreation.toISOString().split('T')[0];

    return (
        <div className="plante-detail">
            <img src={plant.url_photo1 || 'default_plant_image.png'} alt={plant.nom_plante} className="plante-photo" />
            <h3 className="plante-nom">{plant.nom_plante}</h3>
            <p className="plante-description">{plant.description}</p>
            <p className="plante-variete"><strong>Variété:</strong> {plant.variete}</p>
            <p className="plante-date"><strong>Mis en ligne le:</strong> {dateAffichee}</p>
            <button onClick={handleDelete}>Supprimer</button>
            <button onClick={() => setIsModalOpen(true)}>Modifier</button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Modifier Plante"
            >
                <h2>Modifier Plante</h2>
                <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                        <label htmlFor="nom_plante" className="form-label">Nom plante</label>
                        <input type="text" className="form-control" id="nom_plante" name="nom_plante" value={updatedPlant.nom_plante} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3 mt-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input type="text" className="form-control" id="description" name="description" value={updatedPlant.description} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="variete" className="form-label">Variete</label>
                        <input type="text" className="form-control" id="variete" name="variete" value={updatedPlant.variete} onChange={handleInputChange} />
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
                    <button type="submit" className="btn btn-primary submit-btn">Mettre à jour</button>
                </form>
            </Modal>
        </div>
    );
};

export default PlantDetail;
