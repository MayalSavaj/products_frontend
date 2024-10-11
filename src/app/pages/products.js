"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('ASC');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          search: search || undefined,  
          minPrice: minPrice || undefined, 
          maxPrice: maxPrice || undefined, 
          isActive: isActive || undefined,  
          sortField: sortField || undefined,
          sortOrder: sortOrder || undefined, 
        };

        const response = await axios.get('http://localhost:3000/products', { params });
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, minPrice, maxPrice, isActive, sortField, sortOrder]);

  useEffect(() => {
    const filterProducts = () => {
      const lowercasedSearch = search.toLowerCase();
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(lowercasedSearch) ||
        product.description.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [search, products]);

  if (loading) return <CircularProgress />;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={2} style={{marginBottom:"20px"}}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            type="number"
            label="Min Price"
            variant="outlined"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            type="number"
            label="Max Price"
            variant="outlined"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sort Field</InputLabel>
            <Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              label="Sort Field"
            >
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="name">Name</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sort Order</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Sort Order"
            >
              <MenuItem value="ASC">Ascending</MenuItem>
              <MenuItem value="DESC">Descending</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card variant="outlined" style={{ height: '100%' }}>
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'contain',
                }}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {product.qty}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
