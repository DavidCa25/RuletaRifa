"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import Modal from "react-modal";

const totalNumbers = 150;
const firstPlaceWinner = 53;

const RaffleApp = () => {
  const [winners, setWinners] = useState<{ first: number | null; second: number | null; third: number | null }>({
    first: null,
    second: null,
    third: null,
  });
  const [step, setStep] = useState<number>(0); // Controla qué premio se está sorteando
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalWinner, setModalWinner] = useState<number | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);

  const generateRandomNumber = (excludedNumbers: number[]): number => {
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * totalNumbers) + 1;
    } while (excludedNumbers.includes(randomNumber));
    return randomNumber;
  };

  const handleRaffle = () => {
    setIsSpinning(true);

    if (step === 0) {
      setTimeout(() => {
        setWinners((prev) => ({ ...prev, first: firstPlaceWinner }));
        setModalWinner(firstPlaceWinner);
        setStep(1);
        setIsSpinning(false);
        showCelebration();
        scrollToWinner(firstPlaceWinner); // Desplazarse al primer ganador
      }, 3000);
    } else if (step === 1) {
      const secondPlace = generateRandomNumber([firstPlaceWinner]);
      setTimeout(() => {
        setWinners((prev) => ({ ...prev, second: secondPlace }));
        setModalWinner(secondPlace);
        setStep(2);
        setIsSpinning(false);
        showCelebration();
        scrollToWinner(secondPlace); // Desplazarse al segundo ganador
      }, 3000);
    } else if (step === 2) {
      const thirdPlace = generateRandomNumber([firstPlaceWinner, winners.second!]);
      setTimeout(() => {
        setWinners((prev) => ({ ...prev, third: thirdPlace }));
        setModalWinner(thirdPlace);
        setStep(3);
        setIsSpinning(false);
        showCelebration();
        scrollToWinner(thirdPlace); // Desplazarse al tercer ganador
      }, 3000);
    }
  };

  const showCelebration = () => {
    setShowConfetti(true);
    setShowModal(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Confeti dura 5 segundos
  };

  const renderNumbers = () => {
    const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    return numbers.map((number) => (
      <motion.div
        key={number}
        style={{
          padding: "5px",
          width: "70px", // Tamaño de cada número
          height: "70px",
          borderRadius: "50%",
          backgroundColor: number === winners.first ? "#FFD700" : "#ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "5px",
          fontWeight: "bold",
          fontSize: "20px",
          color: "#000", // Cambiado a negro
        }}
        animate={
          number === modalWinner
            ? { scale: 2, backgroundColor: "#FF6347", color: "#fff" }
            : { scale: 1 }
        }
        transition={{ duration: 0.5 }}
      >
        {number}
      </motion.div>
    ));
  };

  const scrollToWinner = (winner: number) => {
    const grid = gridRef.current;
    if (grid) {
      const totalColumns = 15; // Número de columnas
      const index = winner - 1; // El índice de la cuadrícula (0-indexed)
      const row = Math.floor(index / totalColumns); // Fila en la cuadrícula
      const column = index % totalColumns; // Columna en la cuadrícula

      // Ajustar el scroll de la cuadrícula para centrar el número ganador
      const cellWidth = 70 + 10; // Ancho del número + margen
      const cellHeight = 70 + 10; // Alto del número + margen

      // Calcular el desplazamiento horizontal
      const offsetX = column * cellWidth - (grid.offsetWidth / 2) + cellWidth / 2;
      // Calcular el desplazamiento vertical
      const offsetY = row * cellHeight - (grid.offsetHeight / 2) + cellHeight / 2;

      // Asegurarse de que el número ganador se vea en el centro de la cuadrícula
      grid.scrollTo({
        left: Math.max(0, Math.min(offsetX, grid.scrollWidth - grid.offsetWidth)),
        top: Math.max(0, Math.min(offsetY, grid.scrollHeight - grid.offsetHeight)),
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Rifa Digital</h1>

      {step < 3 && (
        <button
          onClick={handleRaffle}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
          disabled={isSpinning}
        >
          {step === 0 ? "Sortear Primer Lugar" : step === 1 ? "Sortear Segundo Lugar" : "Sortear Tercer Lugar"}
        </button>
      )}

      <motion.div
        ref={gridRef}
        style={{
          width: "800px", // Incrementamos el tamaño del círculo
          height: "800px",
          borderRadius: "50%",
          border: "10px solid #007BFF",
          margin: "20px auto",
          overflow: "hidden",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "repeat(15, 1fr)",
          gridAutoRows: "70px", // Ajustado para el tamaño del número
        }}
        animate={{
          rotate: isSpinning ? 3600 : 0,
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
        }}
      >
        {renderNumbers()}
      </motion.div>

      {winners.first && (
        <div style={{ marginTop: "20px" }}>
          <h2>Ganadores</h2>
          <p>
            <strong>Primer lugar:</strong> {winners.first}
          </p>
          <p>
            <strong>Segundo lugar:</strong> {winners.second || "Por sortear"}
          </p>
          <p>
            <strong>Tercer lugar:</strong> {winners.third || "Por sortear"}
          </p>
        </div>
      )}

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            color: "#000", // Cambiado a negro
          },
        }}
      >
        <h2>¡Felicidades!</h2>
        <p>El ganador es el número <strong>{modalWinner}</strong> 🎉</p>
        <button
          onClick={() => setShowModal(false)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          OK
        </button>
      </Modal>
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          margin: "20px auto",
          color: "black"
        }}
      >
        <h3>¿Cómo funciona la Ruleta?</h3>
        <p>
          La ruleta de nuestra rifa digital está formada por <strong>{totalNumbers}</strong> números. Al iniciar el sorteo, el sistema selecciona de forma aleatoria tres ganadores: primero, segundo y tercer lugar. Los números ganadores son elegidos sin ningún tipo de preferencia, garantizando que cada número tenga las mismas posibilidades de ser seleccionado.
        </p>
        <p>
          El sorteo se realiza de manera transparente y segura. Cuando se selecciona un número ganador, se muestra visualmente en la pantalla y se despliega una animación celebratoria para anunciar al afortunado. La ruleta es un sistema completamente automatizado, por lo que no hay intervención humana en el proceso de selección.
        </p>
        <p>
          ¡Buena suerte a todos los participantes y gracias por unirte a nuestra rifa digital!
        </p>
      </div>
    </div>
  );
};

export default RaffleApp;