import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
  useToast,
  Grid,
  GridItem,
  Text,
  HStack,
  Card,
  CardBody,
  Stack,
  Flex,
  Divider,
  Badge,
  Link,
  Image,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { API_ENDPOINTS } from '../../config/api';
import { useNavigate } from 'react-router-dom';
import { EditIcon, DeleteIcon, CalendarIcon, EmailIcon } from '@chakra-ui/icons';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const categories = [
  { value: 'tech-talk', label: '🎤 Tech Talk' },
  { value: 'workshop', label: '🛠️ Workshop' },
  { value: 'hackathon', label: '💻 Hackathon' },
  { value: 'study-jam', label: '📚 Study Jam' },
  { value: 'devfest', label: '🎉 DevFest' },
  { value: 'wtm', label: '👩‍💻 Women Techmakers' },
  { value: 'cloud-event', label: '☁️ Cloud Event' },
  { value: 'io-extended', label: '🌐 I/O Extended' }
];

const newsCategories = [
  { value: 'announcement', label: '📢 Announcement' },
  { value: 'tech-update', label: '🚀 Tech Update' },
  { value: 'community', label: '👥 Community News' },
  { value: 'internship', label: '💼 Internship' },
  { value: 'achievement', label: '🏆 Achievement' },
  { value: 'event-recap', label: '📸 Event Recap' }
];

interface NewsFormData {
  title: string;
  content: string;
  author: string;
  category: string;
  image: string;
  tags: string;
}

interface Event {
  _id?: string;
  title: string;
  date: string;
  description: string;
  image: string;
  link?: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'past';
}

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface NewsItem {
  _id?: string;
  title: string;
  content: string;
  author: string;
  category: string;
  image?: string;
  tags?: string[];
  createdAt?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const initialNewsForm: NewsFormData = {
    title: '',
    content: '',
    author: '',
    category: '',
    image: '',
    tags: '',
  };

  const [newsForm, setNewsForm] = useState(initialNewsForm);

  // Events state
  const [eventForm, setEventForm] = useState<Event>({
    title: '',
    date: '',
    description: '',
    image: '',
    link: '',
    category: '',
    status: 'upcoming'
  });
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Team state
  const [teamForm, setTeamForm] = useState<TeamMember>({
    name: '',
    role: '',
    bio: '',
    image: '',
    email: '',
    linkedin: '',
    twitter: '',
    github: ''
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  // News state
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchTeamMembers();
    fetchNews();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.events);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      toast({
        title: 'Error fetching events',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.team);
      if (!response.ok) throw new Error('Failed to fetch team members');
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      toast({
        title: 'Error fetching team members',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.news);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNewsItems(data);
    } catch (error) {
      toast({
        title: 'Error fetching news',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleLogout = () => {
    // Clear any auth tokens or state
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Force a page reload to clear any cached state
    window.location.href = '/login';
  };

  const handleNewsInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewsForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewsSubmit = async () => {
    if (!newsForm.title || !newsForm.content || !newsForm.author || !newsForm.category) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const url = editingNewsId
        ? `${API_ENDPOINTS.news}/${editingNewsId}`
        : API_ENDPOINTS.news;

      const response = await fetch(url, {
        method: editingNewsId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newsForm.title,
          content: newsForm.content,
          author: newsForm.author,
          category: newsForm.category,
          image: newsForm.image || undefined,
          tags: newsForm.tags ? newsForm.tags.split(',').map(tag => tag.trim()) : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${editingNewsId ? 'update' : 'create'} news`);
      }

      toast({
        title: `News ${editingNewsId ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setNewsForm(initialNewsForm);
      setEditingNewsId(null);
      fetchNews();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventSubmit = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.description || !eventForm.image) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in all required fields',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const url = editingEventId
        ? `${API_ENDPOINTS.events}/${editingEventId}`
        : API_ENDPOINTS.events;

      const response = await fetch(url, {
        method: editingEventId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save event');
      }

      toast({
        title: `Event ${editingEventId ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });

      setEventForm({
        title: '',
        date: '',
        description: '',
        image: '',
        link: '',
        category: '',
        status: 'upcoming'
      });
      setEditingEventId(null);
      fetchEvents();
    } catch (error) {
      toast({
        title: 'Error saving event',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamSubmit = async () => {
    if (!teamForm.name || !teamForm.role || !teamForm.bio) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in all required fields',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const url = editingTeamId
        ? `${API_ENDPOINTS.team}/${editingTeamId}`
        : API_ENDPOINTS.team;

      const response = await fetch(url, {
        method: editingTeamId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save team member');
      }

      toast({
        title: `Team member ${editingTeamId ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });

      setTeamForm({
        name: '',
        role: '',
        bio: '',
        image: '',
        email: '',
        linkedin: '',
        twitter: '',
        github: ''
      });
      setEditingTeamId(null);
      fetchTeamMembers();
    } catch (error) {
      toast({
        title: 'Error saving team member',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (type: 'event' | 'news' | 'team', id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      setIsLoading(true);
      const endpoint = type === 'event' 
        ? API_ENDPOINTS.events 
        : type === 'news' 
        ? API_ENDPOINTS.news 
        : API_ENDPOINTS.team;

      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      toast({
        title: 'Success',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
        status: 'success',
        duration: 3000,
      });

      if (type === 'event') fetchEvents();
      else if (type === 'team') fetchTeamMembers();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to delete ${type}`,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.900" color="white">
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading 
              size="xl" 
              bgGradient="linear(to-r, #4285F4, #0F9D58)" 
              bgClip="text"
            >
              Admin Dashboard
            </Heading>
            <Button
              onClick={handleLogout}
              colorScheme="red"
              variant="outline"
              _hover={{
                bg: 'red.800',
                transform: 'translateY(-2px)',
              }}
              transition="all 0.2s"
            >
              Logout
            </Button>
          </HStack>

          <Tabs 
            variant="soft-rounded" 
            colorScheme="blue" 
            index={activeTab} 
            onChange={setActiveTab}
          >
            <TabList gap={4}>
              <Tab 
                _selected={{ 
                  bg: 'blue.500',
                  color: 'white',
                }}
                px={6}
              >
                Events
              </Tab>
              <Tab 
                _selected={{ 
                  bg: 'blue.500',
                  color: 'white',
                }}
                px={6}
              >
                News
              </Tab>
              <Tab 
                _selected={{ 
                  bg: 'blue.500',
                  color: 'white',
                }}
                px={6}
              >
                Team
              </Tab>
            </TabList>

            <TabPanels mt={8}>
              <TabPanel>
                <VStack spacing={6} align="stretch" bg="gray.800" p={8} borderRadius="xl" boxShadow="xl">
                  <Heading size="lg" color="blue.400">
                    {editingEventId ? 'Edit Event' : 'Add New Event'}
                  </Heading>
                  <Text color="gray.400">Create or edit an event</Text>

                  <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      placeholder="Enter event title"
                      bg="gray.700"
                      border="none"
                    />
                  </FormControl>

                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    <GridItem>
                      <FormControl isRequired>
                        <FormLabel>Date</FormLabel>
                        <Input
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          bg="gray.700"
                          border="none"
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl isRequired>
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={eventForm.category}
                          onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                          placeholder="Select event type"
                          bg="gray.700"
                          border="none"
                          _focus={{
                            bg: 'gray.600',
                            boxShadow: 'none',
                          }}
                          _hover={{
                            bg: 'gray.600',
                          }}
                          sx={{
                            '& option': {
                              bg: 'gray.700',
                              color: 'white',
                              padding: '8px',
                            }
                          }}
                        >
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <FormControl isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={eventForm.status}
                      onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as 'upcoming' | 'ongoing' | 'past' })}
                      bg="gray.700"
                      border="none"
                      _focus={{
                        bg: 'gray.600',
                        boxShadow: 'none',
                      }}
                      _hover={{
                        bg: 'gray.600',
                      }}
                      sx={{
                        '& option': {
                          bg: 'gray.700',
                          color: 'white',
                          padding: '8px',
                        }
                      }}
                    >
                      <option value="upcoming">🔜 Upcoming</option>
                      <option value="ongoing">🔄 Ongoing</option>
                      <option value="past">✅ Past</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      placeholder="Enter event description"
                      bg="gray.700"
                      border="none"
                      rows={6}
                    />
                  </FormControl>

                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    <GridItem>
                      <FormControl isRequired>
                        <FormLabel>Image URL</FormLabel>
                        <Input
                          value={eventForm.image}
                          onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })}
                          placeholder="Enter image URL"
                          bg="gray.700"
                          border="none"
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Registration Link</FormLabel>
                        <Input
                          value={eventForm.link}
                          onChange={(e) => setEventForm({ ...eventForm, link: e.target.value })}
                          placeholder="Enter registration link"
                          bg="gray.700"
                          border="none"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleEventSubmit}
                    isLoading={isLoading}
                    loadingText={editingEventId ? "Updating..." : "Creating..."}
                    mt={4}
                  >
                    {editingEventId ? 'Update Event' : 'Create Event'}
                  </Button>
                </VStack>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} mt={8}>
                  {events.map((event) => (
                    <GridItem key={event._id}>
                      <Card bg="gray.800" overflow="hidden" variant="outline">
                        <Image
                          src={event.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                          alt={event.title}
                          height="200px"
                          objectFit="cover"
                        />
                        <CardBody>
                          <Stack spacing={4}>
                            <Flex justify="space-between" align="start">
                              <Heading size="md" noOfLines={2}>
                                {event.title}
                              </Heading>
                              <HStack>
                                <Tooltip label="Edit event">
                                  <IconButton
                                    aria-label="Edit event"
                                    icon={<EditIcon />}
                                    size="sm"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => {
                                      setEventForm(event);
                                      setEditingEventId(event._id || null);
                                    }}
                                  />
                                </Tooltip>
                                <Tooltip label="Delete event">
                                  <IconButton
                                    aria-label="Delete event"
                                    icon={<DeleteIcon />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => handleDelete('event', event._id!)}
                                  />
                                </Tooltip>
                              </HStack>
                            </Flex>

                            <Text noOfLines={3} color="gray.500">
                              {event.description}
                            </Text>

                            <Divider />

                            <Stack spacing={2}>
                              <Flex align="center" justify="space-between">
                                <HStack>
                                  <CalendarIcon color="gray.500" />
                                  <Text fontSize="sm" color="gray.500">
                                    {new Date(event.date).toLocaleDateString()}
                                  </Text>
                                </HStack>
                                <Badge 
                                  colorScheme={
                                    event.status === 'upcoming' ? 'blue' :
                                    event.status === 'ongoing' ? 'green' : 'purple'
                                  }
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  textTransform="capitalize"
                                  fontSize="sm"
                                  fontWeight="medium"
                                >
                                  {event.status === 'upcoming' && '🔜'}
                                  {event.status === 'ongoing' && '🔄'}
                                  {event.status === 'past' && '✅'}
                                  {event.status}
                                </Badge>
                              </Flex>
                              
                              {event.category && (
                                <Badge
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  textTransform="capitalize"
                                  fontSize="sm"
                                  fontWeight="medium"
                                  colorScheme="blue"
                                  alignSelf="flex-start"
                                >
                                  {categories.find(cat => cat.value === event.category)?.label || event.category}
                                </Badge>
                              )}
                            </Stack>
                          </Stack>
                        </CardBody>
                      </Card>
                    </GridItem>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel>
                <VStack 
                  spacing={6} 
                  align="stretch" 
                  bg="gray.800" 
                  p={8} 
                  borderRadius="xl"
                  boxShadow="xl"
                >
                  <Heading size="lg" color="blue.400">Add News/Internship</Heading>
                  <Text color="gray.400">Create a new news article or internship opportunity</Text>

                  <FormControl isRequired>
                    <FormLabel>Title</FormLabel>
                    <Input
                      name="title"
                      value={newsForm.title}
                      onChange={handleNewsInputChange}
                      placeholder="Enter a compelling title"
                      bg="gray.700"
                      border="none"
                      _focus={{
                        bg: 'gray.600',
                        boxShadow: 'none',
                      }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Content</FormLabel>
                    <Textarea
                      name="content"
                      value={newsForm.content}
                      onChange={handleNewsInputChange}
                      placeholder="Write your article content here..."
                      bg="gray.700"
                      border="none"
                      rows={6}
                      _focus={{
                        bg: 'gray.600',
                        boxShadow: 'none',
                      }}
                    />
                  </FormControl>

                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    <GridItem>
                      <FormControl isRequired>
                        <FormLabel>Author Name</FormLabel>
                        <Input
                          name="author"
                          value={newsForm.author}
                          onChange={handleNewsInputChange}
                          placeholder="Enter author name"
                          bg="gray.700"
                          border="none"
                          _focus={{
                            bg: 'gray.600',
                            boxShadow: 'none',
                          }}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl isRequired>
                        <FormLabel>Category</FormLabel>
                        <Select
                          name="category"
                          value={newsForm.category}
                          onChange={handleNewsInputChange}
                          placeholder="Select news type"
                          bg="gray.700"
                          border="none"
                          _focus={{
                            bg: 'gray.600',
                            boxShadow: 'none',
                          }}
                          _hover={{
                            bg: 'gray.600',
                          }}
                          sx={{
                            '& option': {
                              bg: 'gray.700',
                              color: 'white',
                              padding: '8px',
                            }
                          }}
                        >
                          {newsCategories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <FormControl>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <Input
                      name="image"
                      value={newsForm.image}
                      onChange={handleNewsInputChange}
                      placeholder="Enter image URL"
                      bg="gray.700"
                      border="none"
                      _focus={{
                        bg: 'gray.600',
                        boxShadow: 'none',
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Tags (Optional)</FormLabel>
                    <Input
                      name="tags"
                      value={newsForm.tags}
                      onChange={handleNewsInputChange}
                      placeholder="Enter tags separated by commas"
                      bg="gray.700"
                      border="none"
                      _focus={{
                        bg: 'gray.600',
                        boxShadow: 'none',
                      }}
                    />
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleNewsSubmit}
                    isLoading={isLoading}
                    loadingText="Creating..."
                    mt={4}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                    }}
                    transition="all 0.2s"
                  >
                    Add News Item
                  </Button>
                </VStack>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} mt={8}>
                  {newsItems.map((news) => (
                    <GridItem key={news._id}>
                      <Card bg="gray.800" overflow="hidden" variant="outline">
                        {news.image && (
                          <Image
                            src={news.image}
                            alt={news.title}
                            height="200px"
                            objectFit="cover"
                          />
                        )}
                        <CardBody>
                          <Stack spacing={4}>
                            <Flex justify="space-between" align="start">
                              <Box>
                                <Heading size="md" noOfLines={2}>
                                  {news.title}
                                </Heading>
                                <HStack mt={2}>
                                  <Badge
                                    colorScheme={
                                      news.category === 'announcement' ? 'blue' :
                                      news.category === 'tech-update' ? 'green' :
                                      news.category === 'community' ? 'purple' :
                                      news.category === 'internship' ? 'orange' :
                                      news.category === 'achievement' ? 'yellow' :
                                      'teal'
                                    }
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                  >
                                    {newsCategories.find(cat => cat.value === news.category)?.label || news.category}
                                  </Badge>
                                </HStack>
                              </Box>
                              <HStack>
                                <Tooltip label="Edit news">
                                  <IconButton
                                    aria-label="Edit news"
                                    icon={<EditIcon />}
                                    size="sm"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => {
                                      setNewsForm({
                                        title: news.title,
                                        content: news.content,
                                        author: news.author,
                                        category: news.category,
                                        image: news.image || '',
                                        tags: news.tags?.join(', ') || '',
                                      });
                                      setEditingNewsId(news._id || null);
                                    }}
                                  />
                                </Tooltip>
                                <Tooltip label="Delete news">
                                  <IconButton
                                    aria-label="Delete news"
                                    icon={<DeleteIcon />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => handleDelete('news', news._id!)}
                                  />
                                </Tooltip>
                              </HStack>
                            </Flex>

                            <Text noOfLines={3} color="gray.500">
                              {news.content}
                            </Text>

                            <Divider />

                            <HStack justify="space-between" color="gray.500" fontSize="sm">
                              <Text>By {news.author}</Text>
                              {news.createdAt && (
                                <Text>
                                  {new Date(news.createdAt).toLocaleDateString()}
                                </Text>
                              )}
                            </HStack>

                            {news.tags && news.tags.length > 0 && (
                              <HStack spacing={2} wrap="wrap">
                                {news.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    colorScheme="gray"
                                    variant="subtle"
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                    fontSize="xs"
                                  >
                                    #{tag}
                                  </Badge>
                                ))}
                              </HStack>
                            )}
                          </Stack>
                        </CardBody>
                      </Card>
                    </GridItem>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch" bg="gray.800" p={8} borderRadius="xl" boxShadow="xl">
                  <Heading size="lg" color="blue.400">
                    {editingTeamId ? 'Edit Team Member' : 'Add Team Member'}
                  </Heading>
                  <Text color="gray.400">Add or edit team member information</Text>

                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    <GridItem>
                      <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input
                          value={teamForm.name}
                          onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                          placeholder="Enter member name"
                          bg="gray.700"
                          border="none"
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl isRequired>
                        <FormLabel>Role</FormLabel>
                        <Input
                          value={teamForm.role}
                          onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                          placeholder="Enter member role"
                          bg="gray.700"
                          border="none"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <FormControl isRequired>
                    <FormLabel>Bio</FormLabel>
                    <Textarea
                      value={teamForm.bio}
                      onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                      placeholder="Enter member bio"
                      bg="gray.700"
                      border="none"
                      rows={4}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Image URL</FormLabel>
                    <Input
                      value={teamForm.image}
                      onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })}
                      placeholder="Enter profile image URL"
                      bg="gray.700"
                      border="none"
                    />
                  </FormControl>

                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          value={teamForm.email}
                          onChange={(e) => setTeamForm({ ...teamForm, email: e.target.value })}
                          placeholder="Enter email address"
                          bg="gray.700"
                          border="none"
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>LinkedIn</FormLabel>
                        <Input
                          value={teamForm.linkedin}
                          onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })}
                          placeholder="Enter LinkedIn URL"
                          bg="gray.700"
                          border="none"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    <GridItem>
                      <FormControl>
                        <FormLabel>Twitter</FormLabel>
                        <Input
                          value={teamForm.twitter}
                          onChange={(e) => setTeamForm({ ...teamForm, twitter: e.target.value })}
                          placeholder="Enter Twitter URL"
                          bg="gray.700"
                          border="none"
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem>
                      <FormControl>
                        <FormLabel>GitHub</FormLabel>
                        <Input
                          value={teamForm.github}
                          onChange={(e) => setTeamForm({ ...teamForm, github: e.target.value })}
                          placeholder="Enter GitHub URL"
                          bg="gray.700"
                          border="none"
                        />
                      </FormControl>
                    </GridItem>
                  </Grid>

                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleTeamSubmit}
                    isLoading={isLoading}
                    loadingText={editingTeamId ? "Updating..." : "Creating..."}
                    mt={4}
                  >
                    {editingTeamId ? 'Update Team Member' : 'Add Team Member'}
                  </Button>
                </VStack>

                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} mt={8}>
                  {teamMembers.map((member) => (
                    <GridItem key={member._id}>
                      <Card bg="gray.800" overflow="hidden" variant="outline">
                        <Image
                          src={member.image || 'https://via.placeholder.com/400x400?text=No+Image'}
                          alt={member.name}
                          height="200px"
                          objectFit="cover"
                        />
                        <CardBody>
                          <Stack spacing={4}>
                            <Flex justify="space-between" align="start">
                              <Box>
                                <Heading size="md">{member.name}</Heading>
                                <Text color="blue.400">{member.role}</Text>
                              </Box>
                              <HStack>
                                <Tooltip label="Edit member">
                                  <IconButton
                                    aria-label="Edit member"
                                    icon={<EditIcon />}
                                    size="sm"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => {
                                      setTeamForm(member);
                                      setEditingTeamId(member._id || null);
                                    }}
                                  />
                                </Tooltip>
                                <Tooltip label="Delete member">
                                  <IconButton
                                    aria-label="Delete member"
                                    icon={<DeleteIcon />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => handleDelete('team', member._id!)}
                                  />
                                </Tooltip>
                              </HStack>
                            </Flex>

                            <Text noOfLines={3} color="gray.500">
                              {member.bio}
                            </Text>

                            <Divider />

                            <HStack spacing={4} wrap="wrap">
                              {member.email && (
                                <Link href={`mailto:${member.email}`} isExternal>
                                  <IconButton
                                    aria-label="Email"
                                    icon={<EmailIcon />}
                                    size="sm"
                                    colorScheme="gray"
                                    variant="ghost"
                                  />
                                </Link>
                              )}
                              {member.linkedin && (
                                <Link href={member.linkedin} isExternal>
                                  <IconButton
                                    aria-label="LinkedIn"
                                    icon={<FaLinkedin />}
                                    size="sm"
                                    colorScheme="blue"
                                    variant="ghost"
                                  />
                                </Link>
                              )}
                              {member.twitter && (
                                <Link href={member.twitter} isExternal>
                                  <IconButton
                                    aria-label="Twitter"
                                    icon={<FaTwitter />}
                                    size="sm"
                                    colorScheme="twitter"
                                    variant="ghost"
                                  />
                                </Link>
                              )}
                              {member.github && (
                                <Link href={member.github} isExternal>
                                  <IconButton
                                    aria-label="GitHub"
                                    icon={<FaGithub />}
                                    size="sm"
                                    colorScheme="gray"
                                    variant="ghost"
                                  />
                                </Link>
                              )}
                            </HStack>
                          </Stack>
                        </CardBody>
                      </Card>
                    </GridItem>
                  ))}
                </Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard; 