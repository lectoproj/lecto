'use client';

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../components/Model'; // Ensure the path and case are correct
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { isValid, string } from 'zod';
import { LoadingSpinner, TickLogo } from '@/components/icons';
import { AuthContext } from 'app/contextApi/authContext';
import { motion } from 'framer-motion';
import { Award, Brain, CheckCircle, Medal, Star, Trophy } from 'lucide-react';
interface Pregunta {
  tipo: 'fill-in-the-blank' | 'mcq' | 'radio';
  pregunta: string;
  opciones?: string[];
  correcta: string;
  razon: string;
  isvalid?: boolean;
  answer?: any; // Added to store the user's answer
}

interface Score {
  total: number;
  gained: number;
}

interface Quiz {
  preguntas: Pregunta[];
}

const EvaluacionPage: React.FC = () => {
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const setUserInfo = authContext?.setUserInfo;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [startQuiz, setStartQuiz] = useState<string>('');
  const [score, setScore] = useState<Score | null>(null);
  const [loadingQuiz, setloadingQuiz] = useState<boolean | null>(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  useEffect(() => {
    const storedQuestions = sessionStorage.getItem('currentLecturaQuestions');

    if (!storedQuestions) {
      router.push('/'); // Redirect if no lecture data or questions are available
      return;
    } else {
      const parsedQuestions = JSON.parse(storedQuestions);
      setQuiz(parsedQuestions);

      setStartQuiz('quiz');
    }
  }, [router]);

  const SubmitAnswer = () => {
    if (startQuiz == 'quiz' && selectedQuestionIndex != 9) {
      if (selectedQuestion?.answer) {
        setSelectedQuestionIndex((prev) => prev + 1);
      } else {
        alert('Please fill the answer!');
      }
    } else if (startQuiz == 'quiz' && selectedQuestionIndex == 9) {
      getScores();
    } else if (startQuiz == 'review' && selectedQuestionIndex != 9) {
      setSelectedQuestionIndex((prev) => prev + 1);
    }
  };

  const normalizeString = (str: string): string =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const updateIsValid = (question?: Pregunta) => {
    if (
      !question ||
      question.answer === undefined ||
      question.correcta === undefined
    ) {
      return false;
    }

    if (question?.tipo == 'text') {
      return question?.isvalid;
    }

    // Normalize strings to ignore accents and case sensitivity

    // Check if answer is valid
    return (
      normalizeString(question.answer) == normalizeString(question.correcta)
    );
  };
  const handleChange = (index: number, value: any) => {
    setQuiz((prevQuiz: any) => {
      if (!prevQuiz) return prevQuiz;

      const newQuiz = [...prevQuiz];
      const currentQuestion = { ...newQuiz[index] }; // Clone the current question to ensure immutability

      // First, update the answer for the current question
      currentQuestion.answer = value;

      let isValid = false;

      if (currentQuestion?.tipo === 'mcq') {
        // For MCQ type, check if the value is equal to 'correcta'
        isValid = currentQuestion?.correcta === value;
      } else {
        // For non-MCQ types, use updateIsValid
        isValid = updateIsValid(currentQuestion);
      }

      // Update the isvalid field for the current question
      currentQuestion.isvalid = isValid;

      // Replace the updated question back into the array
      newQuiz[index] = currentQuestion;

      return newQuiz;
    });
  };

  const selectedQuestion: Pregunta | undefined = useMemo(() => {
    if (!quiz || !quiz[selectedQuestionIndex]) return undefined;
    let data = quiz[selectedQuestionIndex];

    let validAnswers = quiz?.length
      ? quiz?.filter((ques: Pregunta) => updateIsValid(ques))
      : [];

    setScore({ total: quiz?.length, gained: validAnswers?.length });

    return { ...data, isvalid: updateIsValid(data) };
  }, [quiz, selectedQuestionIndex]);

  const getUserInfo = async () => {
    const userData = await fetch('/api/userInfo');
    setloadingQuiz(false);

    const response = await userData.json();

    if (response.data.normalCount === 8) {
      router.push('/posttest');
    } else {
      router.push('/lecturas');
    }

    // Ensure setUserInfo exists before calling it
    if (setUserInfo) {
      setUserInfo(response?.data);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setloadingQuiz(true);
    const selectedCategoriaId = sessionStorage.getItem('selectedCategoriaId');
    const currentLecturaTexto = sessionStorage.getItem('currentLecturaTexto');
    const currentLecturaTitulo = sessionStorage.getItem('currentLecturaTitulo');
    const currentLecturaId = sessionStorage.getItem('currentLecturaId');

    let dataToPost = {
      Quiz: quiz,
      title: currentLecturaTitulo,
      text: currentLecturaTexto,
      categoryId: selectedCategoriaId,
      lecturaId: currentLecturaId,
      score
    };

    console.log('dataToPost', dataToPost);

    const response = await fetch('/api/evaluacion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: dataToPost })
    });

    setloadingQuiz(false);

    const result = await response.json();
    if (result?.data) {
      getUserInfo();
    }
  };

  const getScores = async () => {
    setloadingQuiz(true);
    const currentLecturaTexto = sessionStorage.getItem('currentLecturaTexto');

    let dataToPost = {
      texto: currentLecturaTexto,
      questionAnswers: [quiz[8], quiz[9]]
    };

    const response = await fetch('/api/evaluacion/checking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...dataToPost })
    });
    const result = await response.json();

    // console.log('response', result);

    if (result) {
      let updatedQuestions = [...quiz];

      // Remove the last two elements and add two new ones
      updatedQuestions.splice(
        -2,
        2,
        result?.evaluations[0],
        result?.evaluations[1]
      );

      setQuiz(updatedQuestions);
      setloadingQuiz(false);
      setStartQuiz('result');
    }
  };

  const icons = [
    { Icon: CheckCircle, color: 'text-green-500' },
    { Icon: Brain, color: 'text-blue-500' },
    { Icon: Trophy, color: 'text-yellow-500' },
    { Icon: Medal, color: 'text-purple-500' },
    { Icon: Star, color: 'text-pink-500' }
  ];

  return (
    <main
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6"
      key={selectedQuestionIndex}
    >
      {startQuiz == 'quiz' ? (
        <>
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">
              Pregunta #{selectedQuestionIndex + 1}
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-justify p-4">
              {selectedQuestion?.pregunta}

              <div>
                {selectedQuestion?.tipo == 'mcq' ? (
                  <RadioGroup
                    defaultValue={selectedQuestion?.answer}
                    onValueChange={(e: any) => {
                      handleChange(selectedQuestionIndex, e);
                    }}
                  >
                    {selectedQuestion?.opciones.map((op, index) => (
                      <div className="flex items-center space-x-2" key={index}>
                        <RadioGroupItem value={op} id={op} />
                        <Label htmlFor={op}>{op}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Input
                    value={selectedQuestion?.answer}
                    onChange={(e) => {
                      handleChange(selectedQuestionIndex, e.target.value);
                    }}
                  />
                )}
              </div>

              <Button className="mt-3" onClick={SubmitAnswer}>
                Siguiente pregunta {loadingQuiz ? <LoadingSpinner /> : null}
              </Button>
            </div>
          </div>
        </>
      ) : startQuiz == 'result' ? (
        <>
          {/* <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Resultado</h1>
          </div>
          <div className="flex flex-col gap-10 items-center">
            <p className="text-4xl text-black font-bold">Completaste la evaluación!</p>
            <div className="w-[100px]">
              <TickLogo />
            </div>
            <p className="text-lg">Ya vimos tus respuestas, revisa tu retroalimentación.</p>
            <p className="text-4xl text-black font-bold">
              Puntos: {`${score?.gained}/${score?.total}`}
            </p>
            <Button
              onClick={() => {
                setSelectedQuestionIndex(0);
                setStartQuiz('review');
              }}
            >
              Continuar
            </Button>
          </div> */}
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full space-y-8">
              <h1 className="text-3xl font-bold text-center text-gray-800">
                Resultado
              </h1>
              <div className="flex flex-col items-center space-y-6">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl text-gray-700 font-semibold text-center"
                >
                  ¡Completaste la evaluación!
                </motion.p>
                <div className="flex justify-center space-x-4">
                  {icons.map(({ Icon, color }, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Icon className={`w-10 h-10 ${color}`} />
                    </motion.div>
                  ))}
                </div>
                <p className="text-lg text-gray-600 text-center">
                  Ya vimos tus respuestas, revisa tu retroalimentación y comentarios.
                </p>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="flex items-center space-x-2"
                >
                  <Award className="w-8 h-8 text-yellow-500" />
                  <p className="text-3xl text-gray-800 font-bold">
                    Puntos: {`${score?.gained}/${score?.total}`}
                  </p>
                </motion.div>
                <Button
                  onClick={() => {
                    setSelectedQuestionIndex(0);
                    setStartQuiz('review');
                  }}
                  className="w-full"
                >
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">
              Retroalimentación de pregunta #{selectedQuestionIndex + 1}
            </h1>
          </div>
          <div className="flex flex-col items-center gap-3 justify-center rounded-lg border border-dashed shadow-sm p-5">
            {selectedQuestion?.isvalid ? (
              <p className="text-4xl text-[green] font-bold">¡Correcto!</p>
            ) : (
              <p className="text-4xl text-[red] font-bold">¡Incorrecto!</p>
            )}
            <div className="flex flex-col items-start gap-1 text-justify p-4">
              <p className="font-bold">{selectedQuestion?.pregunta}</p>
              <p className="font-bold text-[#074f8c] m-0">
                Respuesta Correcta:
              </p>
              <p className="font-bold text-[#074f8c]">
                {selectedQuestion?.correcta}
              </p>
            </div>
            <p className="text-center">{selectedQuestion?.razon}</p>
            {selectedQuestionIndex != 9 ? (
              <Button className="mt-3" onClick={SubmitAnswer}>
                Siguiente
              </Button>
            ) : (
              <Button className="mt-3" onClick={handleSubmit}>
                Finalizar {loadingQuiz ? <LoadingSpinner /> : null}
              </Button>
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default EvaluacionPage;
