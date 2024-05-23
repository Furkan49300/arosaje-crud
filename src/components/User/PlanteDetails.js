import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../App.css';

const PlanteDetails = () => {
    const location = useLocation();
    const { plante } = location.state;

    const dateCreation = new Date(plante.creele);
    const dateAffichee = dateCreation.toISOString().split('T')[0];

    const userId = localStorage.getItem('id_utilisateur');
    const [reservationId, setReservationId] = useState(null);
    const [reservationDetails, setReservationDetails] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (plante.reservation && plante.reservation.id_reservation) {
            setReservationId(plante.reservation.id_reservation);
            console.log('ID de réservation:', plante.reservation.id_reservation);
        } else {
            console.log('ID de réservation non trouvé');
        }
    }, [plante]);

    useEffect(() => {
        if (reservationId) {
            const token = localStorage.getItem('token');
            fetch(`http://localhost:8080/reservations/${reservationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch reservation details');
                    }
                    return response.json();
                })
                .then(data => {
                    setReservationDetails(data);
                    // Vérifier si la réservation est déjà faite
                    if (data.etat == 1) {
                        setMessage('Déjà réservé');
                    }
                })
                .catch(error => {
                    console.error('Error fetching reservation details:', error);
                });
        }
    }, [reservationId]);

    const handleReservation = () => {
        console.log('User ID:', userId);
        console.log('Reservation ID:', reservationId);

        const token = localStorage.getItem('token');
        fetch(`http://localhost:8080/reservations/${reservationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id_utilisateur: parseInt(userId),
                etat: true
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to make reservation');
                }
            })
            .then(data => {
                setMessage('Réservation réussie!');
                console.log('Réponse de la réservation:', data);
            })
            .catch(error => {
                console.error('Error making reservation:', error);
                setMessage('Échec de la réservation.');
            });
    };

    return (
        <div>
            <h1>Détails de la Plante</h1>
            <div className="plante-conteneur">
                <img src={plante.url_photo1 || 'default_plant_image.png'} alt={plante.nom_plante} className="plante-photo" />
                <h3 className="plante-nom">{plante.nom_plante}</h3>
                <p className="plante-description">{plante.description}</p>
                <p className="plante-variete"><strong>Variété:</strong> {plante.variete}</p>
                <p className="plante-date"><strong>Mis en ligne le:</strong> {dateAffichee}</p>
                {reservationDetails && (
                    <>
                        <p className="reservation-date"><strong>Date de début:</strong> {new Date(reservationDetails.dateDebut).toISOString().split('T')[0]}</p>
                        <p className="reservation-date"><strong>Date de fin:</strong> {new Date(reservationDetails.dateFin).toISOString().split('T')[0]}</p>
                    </>
                )}
                {reservationDetails && reservationDetails.etat == 0 && (
                    <button onClick={handleReservation}>Réserver</button>
                )}
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default PlanteDetails;
