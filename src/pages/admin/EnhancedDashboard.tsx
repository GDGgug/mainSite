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
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { API_ENDPOINTS } from '../../config/api';
import { EditIcon, DeleteIcon, CalendarIcon, EmailIcon, AddIcon } from '@chakra-ui/icons';
import { FaLinkedin, FaTwitter, FaGithub, FaGlobe } from 'react-icons/fa';
import ImageUpload from '../../components/ImageUpload';
import RichTextEditor from '../../components/RichTextEditor';

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

const departments = [
  { value: 'leadership', label: 'Leadership' },
  { value: 'technical', label: 'Technical' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'events', label: 'Events' },
  { value: 'community', label: 'Community' },
  { value: 'design', label: 'Design' },
];

interface NewsFormData {
  title: string;
  content: string;
  summary: string;
  author: string;
  category: string;
  image: string;
  images: string[];
  tags: string[];
  featured: boolean;
}

interface Event {
  _id?: string;
  title: string;
  date: string;
  description: string;
  content: string;
  image: string;
  images: string[];
  link?: string;
  category: string;
  status: 'upcoming' | 'ongoing' | 'past';
  tags: string[];
  maxAttendees?: number;
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
  website?: string;
  department?: string;
  skills: string[];
  isActive: boolean;
}

interface NewsItem {
  _id?: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  category: string;
  image?: string;
  images: string[];
  tags: string[];
  featured: boolean;
  createdAt?: string;
}

const EnhancedDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const initialNewsForm: NewsFormData = {
    title: '',
    content: '',
    summary: '',
    author: '',
    category: '',
    image: '',
    images: [],
    tags: [],
    featured: false,
  };

  const [newsForm, setNewsForm] = useState(initialNewsForm);
  const [newTag, setNewTag] = useState('');

  // Events state
  const [eventForm, setEventForm] = useState<Event>({
    title: '',
    date: '',
    description: '',
    content: '',
    image: '',
    images: [],
    link: '',
    category: '',
    status: 'upcoming',
    tags: [],
    maxAttendees: 0,
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
    github: '',
    website: '',
    department: '',
    skills: [],
    isActive: true,
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');

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

  // Tag management functions
  const addTag = (formType: 'news' | 'event', tag: string) => {
    if (!tag.trim()) return;
    
    if (formType === 'news') {
      if (!newsForm.tags.includes(tag)) {
        setNewsForm(prev => ({
          ...prev,
          tags: [...prev.tags, tag.trim()]
        }));
      }
    } else {
      if (!eventForm.tags.includes(tag)) {
        setEventForm(prev => ({
          ...prev,
          tags: [...prev.tags, tag.trim()]
        }));
      }
    }
  };

  const removeTag = (formType: 'news' | 'event', tagToRemove: string) => {
    if (formType === 'news') {
      setNewsForm(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    } else {
      setEventForm(prev => ({
        ...prev,
        tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
    }
  };

  // Skill management functions
  const addSkill = (skill: string) => {
    if (!skill.trim()) return;
    if (!teamForm.skills.includes(skill)) {
      setTeamForm(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setTeamForm(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Image upload handlers
  const handleNewsImageUpload = (imageUrl: string) => {
    setNewsForm(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleNewsImagesUpload = (imageUrl: string) => {
    setNewsForm(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
  };

  const handleNewsImageRemove = (imageUrl: string) => {
    setNewsForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  };

  const handleEventImageUpload = (imageUrl: string) => {
    setEventForm(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleEventImagesUpload = (imageUrl: string) => {
    setEventForm(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
  };

  const handleEventImageRemove = (imageUrl: string) => {
    setEventForm(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  };

  const handleTeamImageUpload = (imageUrl: string) => {
    setTeamForm(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  // Form submission handlers
  const handleNewsSubmit = async () => {
    if (!newsForm.title || !newsForm.content || !newsForm.author) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const url = editingNewsId 
        ? `${API_ENDPOINTS.news}/${editingNewsId}`
        : API_ENDPOINTS.news;
      
      const method = editingNewsId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsForm),
      });

      if (!response.ok) throw new Error('Failed to save news');

      toast({
        title: 'Success',
        description: `News ${editingNewsId ? 'updated' : 'created'} successfully!`,
        status: 'success',
        duration: 3000,
      });

      setNewsForm(initialNewsForm);
      setEditingNewsId(null);
      fetchNews();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save news',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventSubmit = async () => {
    if (!eventForm.title || !eventForm.description || !eventForm.date) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const url = editingEventId 
        ? `${API_ENDPOINTS.events}/${editingEventId}`
        : API_ENDPOINTS.events;
      
      const method = editingEventId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventForm),
      });

      if (!response.ok) throw new Error('Failed to save event');

      toast({
        title: 'Success',
        description: `Event ${editingEventId ? 'updated' : 'created'} successfully!`,
        status: 'success',
        duration: 3000,
      });

      setEventForm({
        title: '',
        date: '',
        description: '',
        content: '',
        image: '',
        images: [],
        link: '',
        category: '',
        status: 'upcoming',
        tags: [],
        maxAttendees: 0,
      });
      setEditingEventId(null);
      fetchEvents();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save event',
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
        title: 'Missing required fields',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const url = editingTeamId 
        ? `${API_ENDPOINTS.team}/${editingTeamId}`
        : API_ENDPOINTS.team;
      
      const method = editingTeamId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamForm),
      });

      if (!response.ok) throw new Error('Failed to save team member');

      toast({
        title: 'Success',
        description: `Team member ${editingTeamId ? 'updated' : 'added'} successfully!`,
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
        github: '',
        website: '',
        department: '',
        skills: [],
        isActive: true,
      });
      setEditingTeamId(null);
      fetchTeamMembers();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save team member',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (type: 'event' | 'news' | 'team', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    setIsLoading(true);
    try {
      const endpoint = type === 'event' ? API_ENDPOINTS.events : 
                      type === 'news' ? API_ENDPOINTS.news : 
                      API_ENDPOINTS.team;
      
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error(`Failed to delete ${type}`);

      toast({
        title: 'Success',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`,
        status: 'success',
        duration: 3000,
      });

      if (type === 'event') fetchEvents();
      else if (type === 'news') fetchNews();
      else fetchTeamMembers();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : `Failed to delete ${type}`,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (type: 'event' | 'news' | 'team', item: any) => {
    if (type === 'event') {
      setEventForm(item);
      setEditingEventId(item._id);
    } else if (type === 'news') {
      setNewsForm(item);
      setEditingNewsId(item._id);
    } else {
      setTeamForm(item);
      setEditingTeamId(item._id);
    }
  };

  return (
    <Container maxW="1400px" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg" textAlign="center">
          GDG Gug Admin Dashboard
        </Heading>

        <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
          <TabList>
            <Tab>📰 News</Tab>
            <Tab>🎉 Events</Tab>
            <Tab>👥 Team</Tab>
          </TabList>

          <TabPanels>
            {/* News Panel */}
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                <GridItem>
                  <Card>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md">Add/Edit News</Heading>
                        
                        <FormControl isRequired>
                          <FormLabel>Title</FormLabel>
                          <Input
                            value={newsForm.title}
                            onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="News title"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Summary</FormLabel>
                          <Textarea
                            value={newsForm.summary}
                            onChange={(e) => setNewsForm(prev => ({ ...prev, summary: e.target.value }))}
                            placeholder="Brief summary of the news"
                            rows={3}
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Content</FormLabel>
                          <RichTextEditor
                            value={newsForm.content}
                            onChange={(value) => setNewsForm(prev => ({ ...prev, content: value }))}
                            placeholder="Write your news content here..."
                            height="300px"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Author</FormLabel>
                          <Input
                            value={newsForm.author}
                            onChange={(e) => setNewsForm(prev => ({ ...prev, author: e.target.value }))}
                            placeholder="Author name"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={newsForm.category}
                            onChange={(e) => setNewsForm(prev => ({ ...prev, category: e.target.value }))}
                            placeholder="Select category"
                          >
                            {newsCategories.map(cat => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Featured Image</FormLabel>
                          <ImageUpload
                            onImageUpload={handleNewsImageUpload}
                            currentImages={newsForm.image ? [newsForm.image] : []}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Additional Images</FormLabel>
                          <ImageUpload
                            onImageUpload={handleNewsImagesUpload}
                            onImageRemove={handleNewsImageRemove}
                            multiple={true}
                            maxImages={5}
                            currentImages={newsForm.images}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Tags</FormLabel>
                          <InputGroup>
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Add a tag"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addTag('news', newTag);
                                  setNewTag('');
                                }
                              }}
                            />
                            <InputRightElement>
                              <IconButton
                                aria-label="Add tag"
                                icon={<AddIcon />}
                                size="sm"
                                onClick={() => {
                                  addTag('news', newTag);
                                  setNewTag('');
                                }}
                              />
                            </InputRightElement>
                          </InputGroup>
                          <Flex wrap="wrap" gap={2} mt={2}>
                            {newsForm.tags.map((tag, index) => (
                              <Tag key={index} size="md" colorScheme="blue" borderRadius="full">
                                <TagLabel>{tag}</TagLabel>
                                <TagCloseButton onClick={() => removeTag('news', tag)} />
                              </Tag>
                            ))}
                          </Flex>
                        </FormControl>

                        <Button
                          colorScheme="blue"
                          onClick={handleNewsSubmit}
                          isLoading={isLoading}
                          loadingText={editingNewsId ? 'Updating...' : 'Creating...'}
                        >
                          {editingNewsId ? 'Update News' : 'Create News'}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md">News List</Heading>
                        {newsItems.map((news) => (
                          <Card key={news._id} variant="outline">
                            <CardBody>
                              <VStack align="stretch" spacing={3}>
                                <HStack justify="space-between">
                                  <Text fontWeight="bold" noOfLines={1}>
                                    {news.title}
                                  </Text>
                                  <HStack>
                                    <IconButton
                                      aria-label="Edit news"
                                      icon={<EditIcon />}
                                      size="sm"
                                      onClick={() => handleEdit('news', news)}
                                    />
                                    <IconButton
                                      aria-label="Delete news"
                                      icon={<DeleteIcon />}
                                      size="sm"
                                      colorScheme="red"
                                      onClick={() => handleDelete('news', news._id!)}
                                    />
                                  </HStack>
                                </HStack>
                                {news.image && (
                                  <Image
                                    src={news.image}
                                    alt={news.title}
                                    borderRadius="md"
                                    maxH="100px"
                                    objectFit="cover"
                                  />
                                )}
                                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                  {news.summary || news.content}
                                </Text>
                                <HStack justify="space-between">
                                  <Text fontSize="xs" color="gray.500">
                                    By {news.author}
                                  </Text>
                                  <Badge colorScheme="blue">
                                    {news.category}
                                  </Badge>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>

            {/* Events Panel */}
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                <GridItem>
                  <Card>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md">Add/Edit Event</Heading>
                        
                        <FormControl isRequired>
                          <FormLabel>Title</FormLabel>
                          <Input
                            value={eventForm.title}
                            onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Event title"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            value={eventForm.description}
                            onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Brief description"
                            rows={3}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Detailed Content</FormLabel>
                          <RichTextEditor
                            value={eventForm.content}
                            onChange={(value) => setEventForm(prev => ({ ...prev, content: value }))}
                            placeholder="Detailed event information..."
                            height="200px"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Date</FormLabel>
                          <Input
                            type="date"
                            value={eventForm.date}
                            onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={eventForm.category}
                            onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value }))}
                            placeholder="Select category"
                          >
                            {categories.map(cat => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Status</FormLabel>
                          <Select
                            value={eventForm.status}
                            onChange={(e) => setEventForm(prev => ({ ...prev, status: e.target.value as any }))}
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="past">Past</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Featured Image</FormLabel>
                          <ImageUpload
                            onImageUpload={handleEventImageUpload}
                            currentImages={eventForm.image ? [eventForm.image] : []}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Additional Images</FormLabel>
                          <ImageUpload
                            onImageUpload={handleEventImagesUpload}
                            onImageRemove={handleEventImageRemove}
                            multiple={true}
                            maxImages={5}
                            currentImages={eventForm.images}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Registration Link</FormLabel>
                          <Input
                            value={eventForm.link}
                            onChange={(e) => setEventForm(prev => ({ ...prev, link: e.target.value }))}
                            placeholder="https://..."
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Max Attendees</FormLabel>
                          <Input
                            type="number"
                            value={eventForm.maxAttendees}
                            onChange={(e) => setEventForm(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) || 0 }))}
                            placeholder="Maximum number of attendees"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Tags</FormLabel>
                          <InputGroup>
                            <Input
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Add a tag"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addTag('event', newTag);
                                  setNewTag('');
                                }
                              }}
                            />
                            <InputRightElement>
                              <IconButton
                                aria-label="Add tag"
                                icon={<AddIcon />}
                                size="sm"
                                onClick={() => {
                                  addTag('event', newTag);
                                  setNewTag('');
                                }}
                              />
                            </InputRightElement>
                          </InputGroup>
                          <Flex wrap="wrap" gap={2} mt={2}>
                            {eventForm.tags.map((tag, index) => (
                              <Tag key={index} size="md" colorScheme="green" borderRadius="full">
                                <TagLabel>{tag}</TagLabel>
                                <TagCloseButton onClick={() => removeTag('event', tag)} />
                              </Tag>
                            ))}
                          </Flex>
                        </FormControl>

                        <Button
                          colorScheme="blue"
                          onClick={handleEventSubmit}
                          isLoading={isLoading}
                          loadingText={editingEventId ? 'Updating...' : 'Creating...'}
                        >
                          {editingEventId ? 'Update Event' : 'Create Event'}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md">Events List</Heading>
                        {events.map((event) => (
                          <Card key={event._id} variant="outline">
                            <CardBody>
                              <VStack align="stretch" spacing={3}>
                                <HStack justify="space-between">
                                  <Text fontWeight="bold" noOfLines={1}>
                                    {event.title}
                                  </Text>
                                  <HStack>
                                    <IconButton
                                      aria-label="Edit event"
                                      icon={<EditIcon />}
                                      size="sm"
                                      onClick={() => handleEdit('event', event)}
                                    />
                                    <IconButton
                                      aria-label="Delete event"
                                      icon={<DeleteIcon />}
                                      size="sm"
                                      colorScheme="red"
                                      onClick={() => handleDelete('event', event._id!)}
                                    />
                                  </HStack>
                                </HStack>
                                {event.image && (
                                  <Image
                                    src={event.image}
                                    alt={event.title}
                                    borderRadius="md"
                                    maxH="100px"
                                    objectFit="cover"
                                  />
                                )}
                                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                  {event.description}
                                </Text>
                                <HStack justify="space-between">
                                  <Text fontSize="xs" color="gray.500">
                                    {new Date(event.date).toLocaleDateString()}
                                  </Text>
                                  <Badge colorScheme={event.status === 'upcoming' ? 'green' : event.status === 'ongoing' ? 'blue' : 'gray'}>
                                    {event.status}
                                  </Badge>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>

            {/* Team Panel */}
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
                <GridItem>
                  <Card>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md">Add/Edit Team Member</Heading>
                        
                        <FormControl isRequired>
                          <FormLabel>Name</FormLabel>
                          <Input
                            value={teamForm.name}
                            onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Full name"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Role</FormLabel>
                          <Input
                            value={teamForm.role}
                            onChange={(e) => setTeamForm(prev => ({ ...prev, role: e.target.value }))}
                            placeholder="Team role"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Department</FormLabel>
                          <Select
                            value={teamForm.department}
                            onChange={(e) => setTeamForm(prev => ({ ...prev, department: e.target.value }))}
                            placeholder="Select department"
                          >
                            {departments.map(dept => (
                              <option key={dept.value} value={dept.value}>
                                {dept.label}
                              </option>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Bio</FormLabel>
                          <Textarea
                            value={teamForm.bio}
                            onChange={(e) => setTeamForm(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Team member bio"
                            rows={4}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Profile Image</FormLabel>
                          <ImageUpload
                            onImageUpload={handleTeamImageUpload}
                            currentImages={teamForm.image ? [teamForm.image] : []}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          <Input
                            type="email"
                            value={teamForm.email}
                            onChange={(e) => setTeamForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="email@example.com"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>LinkedIn</FormLabel>
                          <Input
                            value={teamForm.linkedin}
                            onChange={(e) => setTeamForm(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="LinkedIn profile URL"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Twitter</FormLabel>
                          <Input
                            value={teamForm.twitter}
                            onChange={(e) => setTeamForm(prev => ({ ...prev, twitter: e.target.value }))}
                            placeholder="Twitter profile URL"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>GitHub</FormLabel>
                          <Input
                            value={teamForm.github}
                            onChange={(e) => setTeamForm(prev => ({ ...prev, github: e.target.value }))}
                            placeholder="GitHub profile URL"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Website</FormLabel>
                          <Input
                            value={teamForm.website}
                            onChange={(e) => setTeamForm(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="Personal website URL"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Skills</FormLabel>
                          <InputGroup>
                            <Input
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Add a skill"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addSkill(newSkill);
                                  setNewSkill('');
                                }
                              }}
                            />
                            <InputRightElement>
                              <IconButton
                                aria-label="Add skill"
                                icon={<AddIcon />}
                                size="sm"
                                onClick={() => {
                                  addSkill(newSkill);
                                  setNewSkill('');
                                }}
                              />
                            </InputRightElement>
                          </InputGroup>
                          <Flex wrap="wrap" gap={2} mt={2}>
                            {teamForm.skills.map((skill, index) => (
                              <Tag key={index} size="md" colorScheme="purple" borderRadius="full">
                                <TagLabel>{skill}</TagLabel>
                                <TagCloseButton onClick={() => removeSkill(skill)} />
                              </Tag>
                            ))}
                          </Flex>
                        </FormControl>

                        <Button
                          colorScheme="blue"
                          onClick={handleTeamSubmit}
                          isLoading={isLoading}
                          loadingText={editingTeamId ? 'Updating...' : 'Adding...'}
                        >
                          {editingTeamId ? 'Update Team Member' : 'Add Team Member'}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md">Team Members</Heading>
                        {teamMembers.map((member) => (
                          <Card key={member._id} variant="outline">
                            <CardBody>
                              <VStack align="stretch" spacing={3}>
                                <HStack justify="space-between">
                                  <Text fontWeight="bold">
                                    {member.name}
                                  </Text>
                                  <HStack>
                                    <IconButton
                                      aria-label="Edit team member"
                                      icon={<EditIcon />}
                                      size="sm"
                                      onClick={() => handleEdit('team', member)}
                                    />
                                    <IconButton
                                      aria-label="Delete team member"
                                      icon={<DeleteIcon />}
                                      size="sm"
                                      colorScheme="red"
                                      onClick={() => handleDelete('team', member._id!)}
                                    />
                                  </HStack>
                                </HStack>
                                {member.image && (
                                  <Image
                                    src={member.image}
                                    alt={member.name}
                                    borderRadius="full"
                                    boxSize="60px"
                                    objectFit="cover"
                                  />
                                )}
                                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                  {member.bio}
                                </Text>
                                <HStack justify="space-between">
                                  <Text fontSize="xs" color="gray.500">
                                    {member.role}
                                  </Text>
                                  <Badge colorScheme="purple">
                                    {member.department || 'General'}
                                  </Badge>
                                </HStack>
                                {member.skills && member.skills.length > 0 && (
                                  <Flex wrap="wrap" gap={1}>
                                    {member.skills.slice(0, 3).map((skill, index) => (
                                      <Tag key={index} size="sm" colorScheme="purple" variant="outline">
                                        {skill}
                                      </Tag>
                                    ))}
                                    {member.skills.length > 3 && (
                                      <Tag size="sm" colorScheme="gray" variant="outline">
                                        +{member.skills.length - 3} more
                                      </Tag>
                                    )}
                                  </Flex>
                                )}
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};

export default EnhancedDashboard; 