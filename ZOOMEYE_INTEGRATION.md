# ZoomEye API Integration Documentation

## Overview

Salem Cyber Vault now includes a complete ZoomEye API integration that allows users to perform live cybersecurity reconnaissance and device discovery through a secure, Halloween-themed interface. The integration follows security best practices by keeping the API key server-side and providing a user-friendly interface for complex queries.

## Features

### 🔮 Live ZoomEye Search
- **Real-time device discovery** using ZoomEye's extensive database
- **Dual search modes**: Host search and Web application search
- **Interactive search interface** with query validation and error handling
- **Paginated results** with detailed device information
- **Halloween-themed UI** matching the Salem Cyber Vault aesthetic

### 👁️ Spectral Queries (Pre-configured Searches)
- **Phantom Cameras**: `device:camera` - Discover security cameras
- **Ghost Databases**: `service:mysql` - Find MySQL database servers
- **Zombie Routers**: `device:router` - Locate network routers
- **Cursed Web Servers**: `app:nginx` - Find Nginx web servers
- **Haunted IoT Devices**: `device:iot` - Discover IoT devices
- **Spectral Printers**: `device:printer` - Find network printers

### 🛡️ Security Features
- **Server-side API key storage** - API key never exposed to frontend
- **Input validation** and sanitization
- **Error handling** with user-friendly messages
- **Rate limiting** through ZoomEye's built-in quotas
- **HTTPS-only communication** with ZoomEye API

## API Endpoints

### Search Endpoint
**POST** `/api/zoomeye/search`

**Request Body:**
```json
{
  "query": "device:camera",
  "page": 1,
  "type": "host",
  "facets": "country,service"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 1500000,
    "available": 1000,
    "matches": [
      {
        "ip": "192.168.1.100",
        "port": 80,
        "protocol": "HTTP",
        "banner": "Camera Web Server",
        "timestamp": "2023-10-01T12:00:00Z",
        "location": {
          "country": "United States",
          "city": "New York",
          "latitude": 40.7128,
          "longitude": -74.0060
        },
        "organization": "Example ISP",
        "service": "HTTP",
        "version": "1.0"
      }
    ]
  },
  "message": "🔮 The digital séance has revealed 20 spectral entities for your query: \"device:camera\"",
  "metadata": {
    "query": "device:camera",
    "page": 1,
    "type": "host",
    "timestamp": "2023-10-01T12:00:00Z"
  }
}
```

### User Info Endpoint
**GET** `/api/zoomeye/user`

**Response:**
```json
{
  "success": true,
  "data": {
    "plan": "premium",
    "resources": {
      "search": "10000"
    },
    "quota": {
      "remain_free_quota": "1000",
      "remain_pay_quota": "9000"
    },
    "email": "user@example.com"
  },
  "message": "🎃 Salem Cyber Vault ZoomEye connection established successfully."
}
```

## Configuration

### Environment Variables
Create a `.env.local` file in the project root:

```bash
# ZoomEye API Configuration
ZOOMEYE_API_KEY=your_zoomeye_api_key_here
```

**Note**: The API key is already configured in the deployed version.

### ZoomEye Account Requirements
- Sign up for a ZoomEye account at [https://www.zoomeye.org/](https://www.zoomeye.org/)
- Generate an API key from your account dashboard
- Free accounts include limited daily searches
- Premium accounts provide expanded quotas and features

## Usage Examples

### Basic Device Search
```javascript
// Search for security cameras
const response = await fetch('/api/zoomeye/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'device:camera',
    type: 'host',
    page: 1
  })
});
```

### Web Application Search
```javascript
// Search for WordPress sites
const response = await fetch('/api/zoomeye/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'app:wordpress',
    type: 'web',
    page: 1
  })
});
```

### Using React Hooks
```jsx
import { useZoomEyeSearch } from '@/lib/use-zoomeye';

function SearchComponent() {
  const { data, loading, error, search } = useZoomEyeSearch();
  
  const handleSearch = async () => {
    await search({
      query: 'device:camera',
      type: 'host',
      page: 1
    });
  };

  return (
    <div>
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      {data && <div>Found {data.total} results</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

## Advanced Query Syntax

ZoomEye supports sophisticated query syntax for precise device discovery:

### Device Filters
- `device:camera` - Security cameras
- `device:router` - Network routers  
- `device:printer` - Network printers
- `device:iot` - Internet of Things devices

### Service Filters
- `service:http` - HTTP services
- `service:ssh` - SSH services
- `service:mysql` - MySQL databases
- `service:ftp` - FTP servers

### Location Filters
- `country:US` - United States
- `city:"New York"` - Specific city
- `region:California` - State/region

### Port Filters
- `port:80` - Specific port
- `port:80,443` - Multiple ports
- `port:8000-9000` - Port range

### Combination Queries
- `device:camera country:US` - US security cameras
- `service:mysql port:3306 country:CN` - Chinese MySQL servers
- `app:nginx country:DE` - German Nginx servers

## Error Handling

The integration includes comprehensive error handling:

### Client-Side Errors
- **Invalid Query**: Empty or malformed search queries
- **Network Errors**: Connection timeouts or failures
- **Rate Limiting**: Quota exceeded responses

### Server-Side Errors
- **Authentication**: Invalid or missing API key
- **API Errors**: ZoomEye service unavailable
- **Validation**: Malformed request parameters

### Error Response Format
```json
{
  "success": false,
  "error": "Invalid query parameter. The spirits require a proper incantation.",
  "message": "👻 The spirits are not responding. Please try your incantation again."
}
```

## Security Considerations

### API Key Protection
- ✅ API key stored in environment variables
- ✅ Never exposed to client-side code
- ✅ Server-side validation and authentication
- ✅ Secure HTTPS communication

### Input Validation
- ✅ Query parameter sanitization
- ✅ Type checking for search parameters
- ✅ SQL injection prevention
- ✅ XSS protection

### Rate Limiting
- ✅ Respects ZoomEye API quotas
- ✅ Client-side request throttling
- ✅ Error handling for quota exceeded

## Integration Points

### Main Application
- **Home Page**: Quick access through main cyber search interface
- **Dashboard**: Full-featured search in `/dashboard/cyber-search`
- **Navigation**: Accessible through main navigation menu

### UI Components
- **ZoomEyeInterface**: Main search and results component
- **CyberSearchInterface**: Updated to include ZoomEye tab
- **Halloween Theme**: Consistent styling with app aesthetic

## Troubleshooting

### Common Issues

**Connection Failed**
```
Error: ZoomEye user info error: fetch failed
```
- Check internet connectivity
- Verify API key is valid
- Ensure ZoomEye service is available

**Search Errors**
```
Error: Invalid query parameter
```
- Verify query syntax is correct
- Check required parameters are provided
- Review ZoomEye documentation for valid filters

**Quota Exceeded**
```
Error: API quota exceeded
```
- Check account limits in ZoomEye dashboard
- Wait for quota reset or upgrade account
- Reduce search frequency

### Debug Mode
Enable debug logging by checking browser console for detailed error messages and API responses.

## Future Enhancements

### Planned Features
- 📊 **Search Analytics**: Track query patterns and results
- 🗺️ **Geographic Visualization**: Map view of discovered devices
- 📁 **Result Export**: CSV/JSON export functionality
- 🔔 **Automated Monitoring**: Scheduled searches with alerts
- 🎯 **Custom Filters**: Advanced filtering and sorting options

### API Enhancements
- **Bulk Search**: Multiple queries in single request
- **Search History**: Store and recall previous searches
- **Favorites**: Save frequently used queries
- **Collaboration**: Share searches with team members

## Support

For issues with the ZoomEye integration:

1. **Check API Status**: Verify ZoomEye service availability
2. **Review Logs**: Check browser console and server logs
3. **Validate Configuration**: Ensure environment variables are set
4. **Test Connectivity**: Use the connection status indicator
5. **Contact Support**: Reach out through the Help & Support section

## License and Terms

This integration is subject to:
- Salem Cyber Vault license terms
- ZoomEye API Terms of Service
- Responsible use guidelines for cybersecurity research

**Remember**: Always use ZoomEye integration for legitimate security research and educational purposes only. Respect privacy and legal boundaries when discovering devices and services.