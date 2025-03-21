import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Image,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Link,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { API_ENDPOINTS } from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
  _id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  link?: string;
  status: 'upcoming' | 'ongoing' | 'past';
}

const EventCard = ({ event }: { event: Event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box
      position="relative"
      borderRadius="xl"
      overflow="hidden"
      bg="rgba(26, 32, 44, 0.7)"
      backdropFilter="blur(12px)"
      borderWidth="1px"
      borderColor="gray.700"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        borderColor: 'blue.400',
      }}
    >
      <Box position="relative" height="200px" overflow="hidden">
        <Image
          src={event.image}
          alt={event.title}
          objectFit="cover"
          w="100%"
          h="100%"
          transition="transform 0.3s"
          _groupHover={{ transform: 'scale(1.05)' }}
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)"
        />
      </Box>

      <VStack spacing={4} p={6} align="start">
        <Badge
          colorScheme={
            event.status === 'upcoming'
              ? 'blue'
              : event.status === 'ongoing'
              ? 'green'
              : 'purple'
          }
          fontSize="sm"
          px={2}
          py={1}
          borderRadius="full"
        >
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </Badge>

        <Heading size="md" color="white">
          {event.title}
        </Heading>

        <Text color="gray.400" noOfLines={3}>
          {event.description}
        </Text>

        <Text fontSize="sm" color="gray.500">
          {formattedDate}
        </Text>

        {event.link && (
          <Button
            as={Link}
            href={event.link}
            isExternal
            rightIcon={<ExternalLinkIcon />}
            size="sm"
            colorScheme="blue"
            variant="solid"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
          >
            Learn More
          </Button>
        )}
      </VStack>
    </Box>
  );
};

const MotionBox = motion(Box);

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    const newIndex = tabIndex + newDirection;
    if (newIndex >= 0 && newIndex <= 2) {
      setPage([page + newDirection, newDirection]);
      setTabIndex(newIndex);
    }
  };

  const filterEvents = (status: Event['status']) => {
    console.log('Filtering events for status:', status);
    console.log('All events:', events);
    
    // Filter based on the status field from the database
    const filtered = events.filter((event) => event.status === status);
    
    console.log('Filtered events:', filtered);
    return filtered;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.events);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        console.log('Fetched events:', data);
        // Sort events by date
        data.sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Box
      minH="100vh"
      pt={20}
      position="relative"
      bg="black"
      overflow="hidden"
    >
      {/* Background Effects */}
      <Box
        position="absolute"
        top="5%"
        left="20%"
        width="600px"
        height="600px"
        background="radial-gradient(circle, rgba(25, 118, 210, 0.1) 0%, transparent 70%)"
        filter="blur(40px)"
        zIndex={0}
      />
      <Box
        position="absolute"
        top="40%"
        right="10%"
        width="500px"
        height="500px"
        background="radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, transparent 70%)"
        filter="blur(40px)"
        zIndex={0}
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center" mb={8}>
            <Heading
              as={motion.h1}
              size="2xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              Community Events
            </Heading>
            <Text
              as={motion.p}
              fontSize="xl"
              color="gray.400"
              mt={4}
              maxW="2xl"
              mx="auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "tween", delay: 0.2 }}
            >
              Join us for exciting tech events, workshops, and meetups. Connect with fellow
              developers and grow together.
            </Text>
          </Box>

          <Tabs 
            variant="soft-rounded" 
            colorScheme="blue" 
            index={tabIndex}
            onChange={(index) => {
              const direction = index > tabIndex ? 1 : -1;
              setPage([page + direction, direction]);
              setTabIndex(index);
            }}
            isLazy
          >
            <TabList 
              justifyContent="center" 
              bg="whiteAlpha.100"
              p={2}
              borderRadius="full"
              mx="auto"
              maxW="fit-content"
              display="flex"
              gap={4}
            >
              <Tab
                _selected={{
                  bg: "blue.400",
                  color: "white",
                  transform: "scale(1.05)",
                }}
                transition="all 0.3s"
                fontWeight="medium"
              >
                Upcoming
              </Tab>
              <Tab
                _selected={{
                  bg: "green.400",
                  color: "white",
                  transform: "scale(1.05)",
                }}
                transition="all 0.3s"
                fontWeight="medium"
              >
                Ongoing
              </Tab>
              <Tab
                _selected={{
                  bg: "purple.400",
                  color: "white",
                  transform: "scale(1.05)",
                }}
                transition="all 0.3s"
                fontWeight="medium"
              >
                Past
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel padding={0}>
                <MotionBox
                  key="upcoming"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  px={4}
                  py={8}
                >
                  {isLoading ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                      {[1, 2, 3].map((i) => (
                        <Box
                          key={i}
                          borderRadius="xl"
                          overflow="hidden"
                          bg="rgba(26, 32, 44, 0.7)"
                          p={6}
                        >
                          <VStack spacing={4} align="stretch">
                            <Skeleton height="200px" />
                            <Skeleton height="20px" width="40%" />
                            <Skeleton height="24px" />
                            <Skeleton height="60px" />
                          </VStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  ) : error ? (
                    <Text color="red.400" textAlign="center">
                      {error}
                    </Text>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                      {filterEvents('upcoming').map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                      {filterEvents('upcoming').length === 0 && (
                        <Text color="gray.400" textAlign="center" gridColumn="1/-1">
                          No upcoming events found.
                        </Text>
                      )}
                    </SimpleGrid>
                  )}
                </MotionBox>
              </TabPanel>

              <TabPanel padding={0}>
                <MotionBox
                  key="ongoing"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  px={4}
                  py={8}
                >
                  {isLoading ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                      {[1, 2, 3].map((i) => (
                        <Box
                          key={i}
                          borderRadius="xl"
                          overflow="hidden"
                          bg="rgba(26, 32, 44, 0.7)"
                          p={6}
                        >
                          <VStack spacing={4} align="stretch">
                            <Skeleton height="200px" />
                            <Skeleton height="20px" width="40%" />
                            <Skeleton height="24px" />
                            <Skeleton height="60px" />
                          </VStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  ) : error ? (
                    <Text color="red.400" textAlign="center">
                      {error}
                    </Text>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                      {filterEvents('ongoing').map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                      {filterEvents('ongoing').length === 0 && (
                        <Text color="gray.400" textAlign="center" gridColumn="1/-1">
                          No ongoing events found.
                        </Text>
                      )}
                    </SimpleGrid>
                  )}
                </MotionBox>
              </TabPanel>

              <TabPanel padding={0}>
                <MotionBox
                  key="past"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  px={4}
                  py={8}
                >
                  {isLoading ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                      {[1, 2, 3].map((i) => (
                        <Box
                          key={i}
                          borderRadius="xl"
                          overflow="hidden"
                          bg="rgba(26, 32, 44, 0.7)"
                          p={6}
                        >
                          <VStack spacing={4} align="stretch">
                            <Skeleton height="200px" />
                            <Skeleton height="20px" width="40%" />
                            <Skeleton height="24px" />
                            <Skeleton height="60px" />
                          </VStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  ) : error ? (
                    <Text color="red.400" textAlign="center">
                      {error}
                    </Text>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                      {filterEvents('past').map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                      {filterEvents('past').length === 0 && (
                        <Text color="gray.400" textAlign="center" gridColumn="1/-1">
                          No past events found.
                        </Text>
                      )}
                    </SimpleGrid>
                  )}
                </MotionBox>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default Events; 