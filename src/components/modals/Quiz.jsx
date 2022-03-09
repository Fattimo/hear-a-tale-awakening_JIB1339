import { ArrowRightIcon, CloseIcon, StarIcon } from '@chakra-ui/icons'
import { Box, Flex, Progress, Text, Loading } from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { HeadphonesIcon } from '../Icons'
import SidebarButton from '../Reader/SidebarButton'

const Quiz = ({ closeQuiz, word = '' }) => {
  const [quiz, setQuiz] = useState({})
  const [correct, setCorrect] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [maxCorrect, setMaxCorrect] = useState(0)
  const [currCorrect, setCurrCorrect] = useState(0)
  const fetchQuiz = useCallback(
    () =>
      fetch(`/api/quiz?letter=${word.charAt(0)}`).then((res) =>
        res.json().then((quiz) => setQuiz(quiz))
      ),
    [word]
  )

  useEffect(() => {
    if (word === '') return
    fetchQuiz()
  }, [fetchQuiz, word])

  const selectAnswer = (i) => {
    if (correct) return
    setSelectedIndex(i)
    if (i === quiz.correctIndex) {
      setCorrect(true)
      setCurrCorrect(currCorrect + 1)
      setMaxCorrect(Math.max(maxCorrect, currCorrect + 1))
    } else {
      setCorrect(false)
      setCurrCorrect(0)
    }
  }

  const nextQuiz = () => {
    setCorrect(null)
    setSelectedIndex(-1)
    if (currCorrect >= 5) {
      closeQuiz()
      return
    }
    fetchQuiz()
  }

  return (
    <Box
      pos={'absolute'}
      w={'100vw'}
      h={'100vh'}
      bgColor={'gray.100'}
      zIndex={10}
      top={0}
      left={0}
    >
      <Flex
        direction={'column'}
        justify={'space-between'}
        align={'center'}
        h={'full'}
        w={'full'}
      >
        <Flex mt={6}>
          {[...Array(5).keys()].map((i) => (
            <StarIcon
              w={6}
              h={6}
              key={i}
              stroke={i < currCorrect ? 'yellow.300' : 'gray.300'}
              strokeWidth={'2px'}
              color={
                i < currCorrect
                  ? 'yellow.300'
                  : i < maxCorrect
                  ? 'gray.300'
                  : 'transparent'
              }
              viewBox={'-1 -1 26 26'}
            />
          ))}
        </Flex>
        <Progress
          colorScheme={'theme.progress'}
          value={80}
          w={'40%'}
          size={'lg'}
          bgColor={'gray.200'}
          borderRadius={8}
          my={4}
        />
        <Flex
          bgColor={'white'}
          flexGrow={1}
          w={'80%'}
          borderTopRadius={'40'}
          pos={'relative'}
          mt={'50px'}
          boxShadow={'2xl'}
          flexShrink={1}
          _after={{
            w: '90%',
            h: 'full',
            pos: 'absolute',
            bottom: '25px',
            right: '5%',
            bgColor: 'white',
            content: '""',
            zIndex: -1,
            borderTopRadius: '40',
            boxShadow: '2xl',
          }}
          _before={{
            w: '80%',
            h: 'full',
            pos: 'absolute',
            bottom: '45px',
            right: '10%',
            bgColor: 'white',
            content: '""',
            zIndex: -1,
            borderTopRadius: '40',
            boxShadow: '2xl',
          }}
        >
          {quiz === {} ? (
            <Loading />
          ) : typeof quiz === 'string' ? (
            <Text w={'full'}>No Quiz For This Word</Text>
          ) : (
            <Flex
              direction={'column'}
              justify={'space-between'}
              align={'center'}
              fontWeight={'bold'}
              h={'full'}
              w={'full'}
            >
              <Text mt={4}>{quiz.definition}</Text>
              <Text color={correct ? 'green.400' : 'red.400'}>
                {correct !== null
                  ? correct
                    ? 'Correct'
                    : 'Incorrect, try again!'
                  : ''}
              </Text>
              <Flex
                justifyContent={'space-between'}
                w={'full'}
                px={12}
                my={2}
                flexShrink={1}
              >
                {quiz.choices?.map((w, i) => (
                  <Flex
                    key={i}
                    flexGrow={1}
                    w={'20%'}
                    style={{ aspectRatio: '1 / 1' }}
                    boxShadow={'0px 14px 31px rgba(0, 0, 0, 0.13);'}
                    borderRadius={20}
                    mx={3}
                    align={'center'}
                    justify={'center'}
                    onClick={() => selectAnswer(i)}
                    bgColor={
                      selectedIndex === i
                        ? correct
                          ? 'green.400'
                          : 'red.400'
                        : null
                    }
                    color={selectedIndex === i ? 'white' : null}
                    cursor={!correct ? 'pointer' : null}
                  >
                    {w}
                  </Flex>
                ))}
              </Flex>
            </Flex>
          )}
        </Flex>
        <SidebarButton pos={'absolute'} top={12} left={16} onClick={closeQuiz}>
          <CloseIcon />
        </SidebarButton>
        <SidebarButton pos={'absolute'} top={12} right={16}>
          {correct === true ? (
            <ArrowRightIcon onClick={nextQuiz} />
          ) : (
            <HeadphonesIcon />
          )}
        </SidebarButton>
      </Flex>
    </Box>
  )
}

export default Quiz
