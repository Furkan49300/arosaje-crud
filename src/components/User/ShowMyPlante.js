import React, { useState, useEffect } from 'react';
import Loader from '../Common/Loader';
import '../../App.css';
import { Link } from 'react-router-dom';

const ShowMyPlante = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [plantList, setPlantList] = useState([]);
    const [noPlantsMessage, setNoPlantsMessage] = useState('');
    const [reservationPlantList, setReservationPlantList] = useState([]);

    useEffect(() => {
        const fetchUserPlants = async () => {
            try {
                const userId = localStorage.getItem('id_utilisateur');
                if (!userId) {
                    throw new Error('User ID not found in localStorage');
                }

                const token = localStorage.getItem('token');
                const url = `http://localhost:8080/plantes/utilisateur/${userId}`;
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setNoPlantsMessage("Vous n'avez aucune plante");
                    } else {
                        throw new Error('Veuillez vous connecter pour visualiser vos plantes');
                    }
                } else {
                    const text = await response.text();
                    const data = text ? JSON.parse(text) : [];
                    setPlantList(data);
                }
            } catch (error) {
                console.error('Error fetching user plants:', error);
                setError(error.message);
            }
        };

        const fetchReservationPlants = async () => {
            try {
                const userId = localStorage.getItem('id_utilisateur');
                if (!userId) {
                    throw new Error('User ID not found in localStorage');
                }

                const token = localStorage.getItem('token');

                // Fetch reservations by user ID
                const reservationsUrl = `http://localhost:8080/reservations/user/${userId}`;
                const reservationsResponse = await fetch(reservationsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!reservationsResponse.ok) {
                    if (reservationsResponse.status === 404) {
                        setNoPlantsMessage("Vous n'avez aucune réservation.");
                    } else {
                        throw new Error('Connectez vous pour voir vos plantes');
                    }
                } else {
                    const reservationsText = await reservationsResponse.text();
                    const reservations = reservationsText ? JSON.parse(reservationsText) : [];

                    const plantsPromises = reservations.map(async (reservation) => {
                        const plantsUrl = `http://localhost:8080/plantes/reservation/${reservation.id_reservation}`;
                        const plantsResponse = await fetch(plantsUrl, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        if (!plantsResponse.ok) {
                            throw new Error(`Failed to fetch plants for reservation ${reservation.id_reservation}`);
                        }
                        const plantsText = await plantsResponse.text();
                        const plants = plantsText ? JSON.parse(plantsText) : [];
                        // Add reservation dates to each plant object
                        plants.forEach(plant => {
                            plant.dateDebut = reservation.dateDebut;
                            plant.dateFin = reservation.dateFin;
                        });
                        return plants;
                    });

                    const plantsResults = await Promise.all(plantsPromises);
                    const allPlants = plantsResults.flat();
                    setReservationPlantList(allPlants);


                }
            } catch (error) {
                console.error('Error fetching reservation plants:', error);
                setError(error.message);
            }
        };

        const fetchAllPlants = async () => {
            setIsLoading(true);
            await Promise.all([fetchUserPlants(), fetchReservationPlants()]);
            setIsLoading(false);
        };

        fetchAllPlants();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Mes plantes</h1>
            <h3>{noPlantsMessage}</h3>
            <div className="plante-liste">
                {plantList.map(plante => {
                    const dateCreation = new Date(plante.creele);
                    const dateAffichee = dateCreation.toISOString().split('T')[0];

                    return (
                        <div className="plante-conteneur" key={plante.id_plante}>
                            <img src={plante.url_photo1 || 'default_plant_image.png'} alt={plante.nom_plante} className="plante-photo" />
                            <h3 className="plante-nom">{plante.nom_plante}</h3>
                            <p className="plante-description">{plante.description}</p>
                            <p className="plante-variete"><strong>Variété:</strong> {plante.variete}</p>
                            <p className="plante-date"><strong>Mis en ligne le:</strong> {dateAffichee}</p>
                            <Link to={`/plante/${plante.id_plante}`}>
                                <button>Voir plus</button>
                            </Link>
                        </div>
                    );
                })}
            </div>
            <h1 className='mt-5'>Mes réservations</h1>
            <div className="plante-liste">
                {reservationPlantList.map(plante => {
                    const dateCreation = new Date(plante.creele);
                    const dateAffichee = dateCreation.toISOString().split('T')[0];
                    const dateDebut = new Date(plante.dateDebut).toISOString().split('T')[0];
                    const dateFin = new Date(plante.dateFin).toISOString().split('T')[0];

                    return (
                        <div className="plante-conteneur" key={plante.id_plante}>
                            <img src={plante.url_photo1 || 'default_plant_image.png'} alt={plante.nom_plante} className="plante-photo" />
                            <h3 className="plante-nom">{plante.nom_plante}</h3>
                            <p className="plante-description">{plante.description}</p>
                            <p className="plante-variete"><strong>Variété:</strong> {plante.variete}</p>
                            <p className="plante-date"><strong>Mis en ligne le:</strong> {dateAffichee}</p>
                            <p className="plante-date"><strong>Date de début de réservation:</strong> {dateDebut}</p>
                            <p className="plante-date"><strong>Date de fin de réservation:</strong> {dateFin}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShowMyPlante;
