const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { promisify } = require('util');
const config = require('../config');
const { logger } = require('../middleware/logging');

// Load proto definitions
const loadProtoDefinition = (protoPath) => {
  return protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
};

// Create product service client
const createProductClient = () => {
  try {
    const PROTO_PATH = path.join(__dirname, '../../protos/product.proto');
    const packageDefinition = loadProtoDefinition(PROTO_PATH);
    const productProto = grpc.loadPackageDefinition(packageDefinition).product;
    
    const client = new productProto.ProductService(
      config.services.product.grpcUrl,
      grpc.credentials.createInsecure()
    );
    
    // Promisify methods
    client.getProductsAsync = promisify(client.getProducts).bind(client);
    client.getProductAsync = promisify(client.getProduct).bind(client);
    
    return client;
  } catch (error) {
    logger.error('Failed to create product gRPC client:', error);
    throw error;
  }
};

// Create merch service client
const createMerchClient = () => {
  try {
    const PROTO_PATH = path.join(__dirname, '../../protos/merch.proto');
    const packageDefinition = loadProtoDefinition(PROTO_PATH);
    const merchProto = grpc.loadPackageDefinition(packageDefinition).merch;
    
    const client = new merchProto.MerchService(
      config.services.merch.grpcUrl,
      grpc.credentials.createInsecure()
    );
    
    // Promisify methods
    client.getMerchesAsync = promisify(client.getMerches).bind(client);
    client.getMerchAsync = promisify(client.getMerch).bind(client);
    
    return client;
  } catch (error) {
    logger.error('Failed to create merch gRPC client:', error);
    throw error;
  }
};

// Create auth service client
const createAuthClient = () => {
  try {
    const PROTO_PATH = path.join(__dirname, '../../protos/auth.proto');
    const packageDefinition = loadProtoDefinition(PROTO_PATH);
    const authProto = grpc.loadPackageDefinition(packageDefinition).auth;
    
    const client = new authProto.AuthService(
      config.services.auth.grpcUrl,
      grpc.credentials.createInsecure()
    );
    
    // Promisify methods
    client.getAuthAsync = promisify(client.getAuth).bind(client);
    client.verifyAsync = promisify(client.verify).bind(client);
    
    return client;
  } catch (error) {
    logger.error('Failed to create auth gRPC client:', error);
    throw error;
  }
};

module.exports = {
  createProductClient,
  createMerchClient,
  createAuthClient
};
